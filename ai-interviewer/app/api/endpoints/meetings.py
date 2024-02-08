import base64

import requests
from app.api.deps import get_current_active_user, get_current_user
from app.core.session import supabase
from app.schemas.requests import InterviewCreateRequest
from app.schemas.responses import InterviewCreateResponse, UserResponse
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from gotrue.errors import AuthApiError

router = APIRouter()


@router.post("/", response_model=InterviewCreateResponse)
async def create_interview(
    interview: InterviewCreateRequest,
    current_user: str = Depends(get_current_active_user)
):
    try:
        interview = interview.model_dump()
        interview['hr'] = current_user['user_id']
        data, count = supabase.table('interviews').insert(
            interview).execute()
        return data[1][0]
    except Exception as e:
        return JSONResponse(content={"message": f"Unexpected Error. Try Again", "error": str(e)}, status_code=400)


@router.get("/")
async def get_interviews(current_user: str = Depends(get_current_active_user)):
    print(current_user)
    try:
        # fetch interviews from data from interviews table using user_id
        data, count = supabase.table('interviews').select(
            "*").eq(str(current_user['role']), current_user['user_id']).execute()
        return data[1]
    except Exception as e:
        return JSONResponse(content={"message": f"Unexpected Error. Try Again", "error": str(e)}, status_code=401)


@router.get("/me")
async def get_me(token: str):
    try:
        from gotrue.errors import AuthApiError
        user = supabase.auth.get_session()
        return user
    except AuthApiError as e:
        return JSONResponse(content={"message": f"Unexpected Error. Try Again", "error": str(e)}, status_code=401)