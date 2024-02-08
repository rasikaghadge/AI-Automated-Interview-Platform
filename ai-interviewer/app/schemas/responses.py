from datetime import datetime

from pydantic import BaseModel, ConfigDict


class BaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class UserResponse(BaseResponse):
    id: str
    access_token: str
    refresh_token: str


class InterviewBaseResponse(BaseResponse):
    title: str
    description: str


class InterviewCreateResponse(InterviewBaseResponse):
    id: int
    start_datetime: datetime | str
    end_datetime: datetime | str
    hr: str
    candidate: str
    status: str


class UserProfileResponse(BaseModel):
    pass 

class SelfUserProfileResponse(UserProfileResponse):
    pass