from pydantic import BaseModel, ConfigDict


class BaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)



class UserResponse(BaseResponse):
    access_token: str
    refresh_token: str


class InterviewBaseResponse(BaseResponse):
    id: str
    title: str
    description: str


class InterviewCreateResponse(InterviewBaseResponse):
    pass


class InterviewUpdateResponse(InterviewBaseResponse):
    pass
