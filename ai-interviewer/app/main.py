from app.api.endpoints import meetings, users
from app.core import config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app = FastAPI(
    title=config.settings.PROJECT_NAME,
    version='1.0',
    description='ai-interviewer',
    openapi_url="/openapi.json",
    docs_url="/",
)
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(meetings.router, prefix="/interviews", tags=["Interviews"])


# Sets all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin)
                   for origin in config.settings.BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Guards against HTTP Host Header attacks
app.add_middleware(TrustedHostMiddleware,
                   allowed_hosts=config.settings.ALLOWED_HOSTS)
