from pydantic import BaseModel, EmailStr


class BaseRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshTokenRequest(BaseRequest):
    refresh_token: str


class UserUpdatePasswordRequest(BaseRequest):
    password: str


class UserCreateRequest(BaseRequest):
    first_name: str
    last_name: str


class UserLoginRequest(BaseRequest):
    email: EmailStr
    password: str


class InterviewBaseRequest(BaseRequest):
    title: str
    description: str


class InterviewCreateRequest(InterviewBaseRequest):
    pass


class InterviewUpdateRequest(InterviewBaseRequest):
    pass
