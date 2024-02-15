from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime
from typing import Any

class BaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class AccessTokenResponse(BaseResponse):
    token_type: str
    access_token: str
    expires_at: int
    issued_at: int
    refresh_token: str
    refresh_token_expires_at: int
    refresh_token_issued_at: int


class UserResponse(BaseResponse):
    id: str
    email: EmailStr


class InterviewResponse(BaseResponse):
    title: str 
    description: str 
    start_datetime: datetime | str
    end_datetime: datetime | str 
    candidate: Any 
    hr: Any 
    status: str



class InterviewListResponse(BaseResponse):
    pass 