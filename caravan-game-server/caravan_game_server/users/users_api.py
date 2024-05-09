from caravan_game_server.users.crypto import (
    get_password_hash,
    oauth2_scheme,
    SECRET_KEY,
    ALGORITHM,
    TokenData,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    Token,
    create_access_token,
)
from caravan_game_server.users.dependencies import UserDependency
from caravan_game_server.users.players_storage import (
    UserAlreadyExists,
    storage as user_storage,
)
from caravan_game_server.db.db import User as UserDBModel
from caravan_game_server.users.model import User

from datetime import timedelta
from typing import Annotated
from fastapi import Depends, HTTPException, status, APIRouter
from jose import JWTError, jwt
from pydantic import BaseModel


router = APIRouter(prefix="/users")


class RegisterUserData(BaseModel):
    name: str
    password: str


@router.post("/create")
def create_user(data: RegisterUserData):
    try:
        hashed_password = get_password_hash(data.password)
        user = user_storage.create_new_user(data.name, hashed_password)
    except UserAlreadyExists as e:
        return {"error": "User already exists"}

    return user


@router.post("/login")
def login(data: RegisterUserData):
    user = user_storage.authenticate_user(data.name, data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.name}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@router.get("/whoami", response_model=User)
async def read_users_me(
    current_user: UserDependency,
):
    return current_user


@router.get("/{user_id}/get")
def get_user(user_id: str):
    try:
        user = user_storage.get_user_by_id(user_id)
    except KeyError:
        raise HTTPException(404, "User not found")

    return user


@router.get("/stat")
def get_stat():
    try:
        stat = user_storage.get_users_stat()

        return stat
    except KeyError:
        raise HTTPException(404, "User not found")
