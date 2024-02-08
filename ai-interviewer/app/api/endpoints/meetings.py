import base64
from typing import Annotated, List

import requests
from app.api.deps import (
    get_current_active_hr,
    get_current_active_user,
    get_current_user
)
from app.core import config
from app.core.session import supabase
from app.schemas.requests import InterviewCreateRequest
from app.schemas.responses import InterviewCreateResponse, UserResponse
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse, StreamingResponse
from gotrue.errors import AuthApiError
from openai import OpenAI

router = APIRouter()

client = OpenAI(
    api_key=config.settings.OPENAI_API_KEY,
    organization=config.settings.OPENAI_API_KEY
)


@router.post("/", response_model=InterviewCreateResponse)
async def create_interview(
    interview: InterviewCreateRequest,
    current_user: str = Depends(get_current_active_hr)
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


# Audio conversation
def audio_to_text(audio_file) -> str:
    try:
        transcript = client.audio.transcriptions.create(
            file=audio_file,
            model='whisper-1'
        )
        return transcript['text']
    except Exception as e:
        return None


def text_to_audio(text: str):
    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=text
    )
    return response.content


def get_recent_messages(limit: int) -> List[str]:
    pass


def get_chat_response(input_message) -> str:
    messages: list = get_recent_messages()
    user_message = {"role": "user", "content": input_message}
    messages.append(user_message)

    try:
        response = client.chat.completions.create(
            messages=messages,
            model='gpt-3.5-turbo'
        )
        message_text = response["choices"][0]["message"]["content"]
        return message_text
    except Exception as e:
        return None


@router.post('/audio')
async def process_user_query(file: Annotated[UploadFile, File(description='User query audio data')]):
    with open(file.filename, "wb") as buffer:
        buffer.write(file.file.read())
    audio_input = open(file.filename, "rb")
    message_decoded = audio_to_text(audio_input)

    if not message_decoded:
        raise HTTPException(status_code=400, detail="Failed to decode audio")

    chat_response = get_chat_response(message_decoded)

    if not chat_response:
        raise HTTPException(status_code=400, detail="Failed chat response")

    audio_output = text_to_audio(chat_response)

    if not audio_output:
        raise HTTPException(status_code=400, detail="Failed audio output")

    def iterfile():
        yield audio_output

    return StreamingResponse(iterfile(), media_type="application/octet-stream")
