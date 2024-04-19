from caravan_game_server.caravan.dependencies import UserIDDependency
from fastapi import APIRouter, HTTPException
from caravan_game_server.users.players_storage import storage as user_storage

from pydantic import BaseModel

router = APIRouter(prefix="/users")


class RegisterUserData(BaseModel):
    name: str


@router.post("/create")
def create_user(user_id: UserIDDependency, data: RegisterUserData):
    user = user_storage.create_new_user(user_id, data.name)
    return user


@router.get("/whoami")
def whoami(user_id: UserIDDependency):
    try:
        user = user_storage.get_user_by_id(user_id)
    except KeyError:
        raise HTTPException(404, "User not found")

    return user

@router.get("/{user_id}/get")
def get_user(user_id: str):
    try:
        user = user_storage.get_user_by_id(user_id)
    except KeyError:
        raise HTTPException(404, "User not found")

    return user
