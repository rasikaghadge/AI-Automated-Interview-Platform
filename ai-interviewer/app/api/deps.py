from typing import Annotated

from app.core.session import supabase
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    if token is None:
        raise HTTPException(status_code=403, detail='Unauthorized')

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        user = supabase.auth.get_user(token).model_dump()
        if user is None:
            raise credentials_exception
        return {'id': user['user']['id']}
    except JWTError:
        raise credentials_exception


def get_current_active_user(current_user: dict = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=403, detail='Unauthorized')
    # fetch user from data from profile table using user_id
    print(current_user)
    data, count = supabase.table('profile').select(
        "*").eq('user_id', current_user['id']).execute()
    if not data:
        raise HTTPException(status_code=404, detail='User not found')
    return data[1][0]
