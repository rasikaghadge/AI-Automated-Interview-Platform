from app.core.session import supabase
from app.schemas.requests import UserCreateRequest, UserLoginRequest
from app.schemas.responses import UserResponse
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from gotrue.errors import AuthApiError

router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register_new_user(
    new_user: UserCreateRequest,
):
    try:
        res = supabase.auth.sign_up(new_user.model_dump()).model_dump()
        print(type(res))
        return UserResponse(access_token=res['session']['access_token'], refresh_token=res['session']['refresh_token'])
    except AuthApiError as e:
        return JSONResponse(content={"message": f"User already exist with {new_user.email}", "error": str(e)}, status_code=401)
    except Exception as e:
        return JSONResponse(content={"message": f"Unexpected Error. Try Again", "error": str(e)}, status_code=401)


@router.post("/login", response_model=UserResponse)
async def login(
    new_user: UserLoginRequest,
):
    try:
        res = supabase.auth.sign_in_with_password(new_user.model_dump()).model_dump()
        return UserResponse(access_token=res['session']['access_token'], refresh_token=res['session']['refresh_token'])
    except AuthApiError as e:
        return JSONResponse(content={"message": f"User does not exist with {new_user.email}", "error": str(e)}, status_code=401)
