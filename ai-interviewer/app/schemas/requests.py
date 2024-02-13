from datetime import datetime
from typing import List, Literal
from typing import Dict
from pydantic import BaseModel, EmailStr, Field, ValidationError, field_validator


class BaseUserRequest(BaseModel):
    email: EmailStr
    password: str


class UserCreateRequest(BaseUserRequest):
    first_name: str
    last_name: str
    role: Literal['candidate', 'hr'] = 'candidate'


class UserLoginRequest(BaseUserRequest):
    pass


class SocialLinks(BaseModel):
    name: str
    link: str


class EducationDuration(BaseModel):
    start: str
    end: str


class Education(BaseModel):
    degree: str
    college: str
    duration: EducationDuration


class Experience(BaseModel):
    company: str
    role: str
    duration: EducationDuration
    description: str


class ExternalAttributes(BaseModel):
    socialLinks: List[SocialLinks] | None = None
    education: List[Education] | None = None
    experience: List[Experience] | None = None


class UserProfileCreateRequest(BaseModel):
    user_id: str
    first_name: str | None = None
    last_name: str | None = None
    country: str | None = 'India'
    profile_picture: str | None = None
    interviews: List[str] | None = None
    company: str | None = None  # for HR
    experience: int = 0
    external_attributes: ExternalAttributes | None = None

    @field_validator('experience')
    def experience_validator(cls, v):
        if v < 0:
            raise ValidationError('experience cannot be negative')


class InterviewBaseRequest(BaseModel):
    title: str
    description: str


class InterviewCreateRequest(InterviewBaseRequest):
    start_datetime: datetime | str
    end_datetime: datetime | str
    candidate: str
    status: Literal['scheduled', 'completed',
                    'cancelled', 'live'] = 'scheduled'

    # convert start_datetime and end_datetime to json serializable format

    @field_validator('start_datetime', mode="before")
    def start_datetime_validator(cls, v):
        v = datetime.fromisoformat(v)
        return v.isoformat()

    @field_validator('end_datetime', mode="before")
    def end_datetime_validator(cls, v):
        v = datetime.fromisoformat(v)
        return v.isoformat()

    @field_validator('end_datetime', mode="before")
    def end_datetime_must_be_greater_than_start_datetime(cls, end_datetime, values):
        if 'start_datetime' in values.data and end_datetime < values.data['start_datetime']:
            raise ValueError(
                'end_datetime must be greater than start_datetime')
        return end_datetime


class InterviewUpdateRequest(InterviewBaseRequest):
    pass
