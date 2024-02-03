from typing import List, Literal

from pydantic import BaseModel, EmailStr


class BaseUserRequest(BaseModel):
    email: EmailStr
    password: str


class UserCreateRequest(BaseUserRequest):
    first_name: str
    last_name: str
    role: Literal['candidate', 'hr'] = 'candidate'
    profile: int | str | EmailStr | None = None


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


class InterviewBaseRequest(BaseModel):
    title: str
    description: str


class InterviewCreateRequest(InterviewBaseRequest):
    pass


class InterviewUpdateRequest(InterviewBaseRequest):
    pass
