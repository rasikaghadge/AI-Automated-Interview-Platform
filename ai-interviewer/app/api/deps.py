from typing import Annotated

from app.core.session import supabase
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/token")


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    if token is None:
        raise HTTPException(status_code=403, detail='Unauthorized')

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = supabase.auth.get_user(token).model_dump()
        username: str = payload['user']['id']
        if username is None:
            raise credentials_exception
        return username
    except JWTError:
        raise credentials_exception
