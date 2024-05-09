from caravan_game_server.users.crypto import (
    oauth2_scheme,
    SECRET_KEY,
    ALGORITHM,
    TokenData,
)

from caravan_game_server.db.db import User as UserDBModel

from typing import Annotated
from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt


def get_current_user_dependency(
    token: Annotated[str, Depends(oauth2_scheme)]
) -> UserDBModel:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")  # type: ignore
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception

    user = UserDBModel.get(UserDBModel.name == username)

    if user is None:
        raise credentials_exception
    return user


UserDependency = Annotated[UserDBModel, Depends(get_current_user_dependency)]
