from pathlib import Path
from typing import Any, List

from app.api import deps
from app.core.config import PROJECT_DIR
from app.core.session import get_db
from app.models import Interview, Profile, User
from app.schemas.requests import InterviewCreateRequest, InterviewUpdateRequest
from app.schemas.responses import InterviewResponse
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/")
async def create_interview(
    new_interview: InterviewCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    user_profile: Profile = current_user.profile
    interview = Interview(
        title=new_interview.title,
        description=new_interview.description,
        end_datetime=new_interview.end_datetime,
        start_datetime=new_interview.start_datetime,
        candidate_id=user_profile.id,
        hr_id=user_profile.id,
        status=new_interview.status,
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview


@router.get("/", response_model=List[InterviewResponse])
async def get_interviews(
    candidate_id: int = None,
    hr_id: int = None,
    db: Session = Depends(get_db),
):
    if candidate_id:
        interviews = db.query(Interview).filter(
            Interview.candidate_id == candidate_id).all()
    elif hr_id:
        interviews = db.query(Interview).filter(Interview.hr_id == hr_id).all()
    else:
        interviews = db.query(Interview).all()
    return interviews


@router.patch("/{interview_id}", response_model=InterviewResponse)
async def update_interview(
    interview_id: int,
    interview_update: InterviewUpdateRequest,
    db: Session = Depends(get_db),
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    for attr, value in interview_update.dict(exclude_unset=True).items():
        setattr(interview, attr, value)
    db.commit()
    db.refresh(interview)
    return interview


@router.delete("/{interview_id}", status_code=204)
async def delete_interview(
    interview_id: int,
    db: Session = Depends(get_db),
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    db.delete(interview)
    db.commit()
    return {"message": "Interview deleted successfully"}


@router.post('/chat')
def get_chat_response(file: UploadFile):
    data = {
        "file_name": file.filename,
        "content_type": file.content_type,
        "file": file.file,
        "PROJECT_DIR": PROJECT_DIR
    }

    def interfile():
        with open(file.filename, 'rb') as audio_file:
            yield from audio_file
    return StreamingResponse(interfile(), media_type='audio/mpeg')


# @router.get('/chat')
# def get_chat_response():
#     print(Path.joinpath(PROJECT_DIR, 'my_audio.mp3'))
#     # context = None

#     def interfile():
#         with open(Path.joinpath(PROJECT_DIR, 'my_audio.mp3'), 'rb') as audio_file:
#             yield from audio_file
#     # return context
#     return StreamingResponse(interfile(), media_type='audio/mpeg')
