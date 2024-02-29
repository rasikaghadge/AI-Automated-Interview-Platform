"""Main FastAPI app instance declaration."""

from app.api.api import api_router
from app.core import config
from app.core.session import engine
from app.models import Base
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title=config.settings.PROJECT_NAME,
    version=config.settings.VERSION,
    description=config.settings.DESCRIPTION,
    openapi_url="/openapi.json",
    docs_url="/",
)
app.include_router(api_router)

# Sets all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,                 
    allow_methods=["*"],
    allow_headers=["*"],
)
