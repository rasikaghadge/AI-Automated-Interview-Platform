import base64
from datetime import timedelta
from typing import Annotated

import requests
from app.api.deps import (
    get_current_active_hr,
    get_current_active_user,
    get_current_user,
)
from app.core.session import supabase
from app.schemas.requests import (
    UserCreateRequest,
    UserLoginRequest,
    UserProfileCreateRequest,
)
from app.schemas.responses import UserResponse
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from gotrue.errors import AuthApiError

router = APIRouter()


def get_profile_picture_by_name(name: str) -> str | None:
    response = requests.get(f"https://ui-avatars.com/api/?name={name}")
    if response.status_code == 200:
        base64_string = base64.b64encode(response.content).decode()
        return base64_string
    return None


def create_profile(user: UserProfileCreateRequest):
    try:
        user.profile_picture = get_profile_picture_by_name(
            f"{user.first_name} {user.last_name}")
        data, count = supabase.table('profile').insert(
            user.model_dump()).execute()
        return data
    except Exception as e:
        return JSONResponse(content={"message": f"Unexpected Error. Try Again", "error": str(e)}, status_code=401)


@router.post("/register", response_model=UserResponse)
async def register_new_user(
    new_user: UserCreateRequest,
):
    try:
        res = supabase.auth.sign_up(new_user.model_dump()).model_dump()
        create_profile(UserProfileCreateRequest(
            user_id=res['user']['id'], first_name=new_user.first_name, last_name=new_user.last_name, role=new_user.role))
        return UserResponse(id=res['user']['id'], access_token=res['session']['access_token'], refresh_token=res['session']['refresh_token'])
    except AuthApiError as e:
        return JSONResponse(content={"message": f"User already exist with {new_user.email}", "error": str(e)}, status_code=401)
    except Exception as e:
        return JSONResponse(content={"message": f"Unexpected Error. Try Again", "error": str(e)}, status_code=401)


@router.post("/profile")
async def create_user_profile(
    user: UserProfileCreateRequest,
):
    return create_profile(user)


@router.get("/profile")
async def get_user_profile(
    user_id: str,
):
    try:
        data, count = supabase.table('profile').select(
            "*").eq('user_id', user_id).execute()
        return data
    except Exception as e:
        return JSONResponse(content={"message": f"Unexpected Error. Try Again", "error": str(e)}, status_code=401)


@router.get("/profile/{user_id}")
async def get_user_profile(
    user_id: str,
):
    try:
        data, count = supabase.table('profile').select(
            "*").eq('user_id', user_id).execute()
        return data
    except Exception as e:
        return JSONResponse(content={"message": f"Unexpected Error. Try Again", "error": str(e)}, status_code=401)


@router.put("/profile")
async def update_user_profile(
    user: UserProfileCreateRequest,
):
    try:
        data, count = supabase.table('profile').update(
            user.model_dump()).eq('user_id', user.user_id).execute()
        return data
    except Exception as e:
        return JSONResponse(content={"message": f"Unexpected Error. Try Again", "error": str(e)}, status_code=401)


@router.post("/login", response_model=UserResponse)
async def login_for_access_token(
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        user = supabase.auth.sign_in_with_password({
            "email": form_data.username,
            "password": form_data.password
        }).model_dump()
    except AuthApiError as e:
        credentials_exception
    if not user:
        credentials_exception
    return UserResponse(id=user['user']['id'], access_token=user['session']['access_token'], refresh_token=user['session']['refresh_token'])


@router.get('/me')
def get_user_me(current_user: dict = Depends(get_current_active_hr)):
    return current_user
