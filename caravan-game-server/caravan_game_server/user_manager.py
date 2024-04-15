from typing import Annotated
from typing_extensions import Doc
from blinker import NamedSignal, signal
from caravan_game_server.players_storage import UserStorage
from fastapi import HTTPException, Response
from pydantic import BaseModel
from caravan_game_server.network.fastapi import fastapiApp

USER_STORAGE_FILE = "./test_users.json"


class RegisterUserData(BaseModel):
    name: str


class UserManager:

    ssig = signal("eblan", doc="eblansss")
    """Docstring for class variable A.x"""

    def __init__(self):
        self.user_storage = UserStorage(USER_STORAGE_FILE)

        fastapiApp.add_api_route("/register", self.register_user, methods=["POST"])  # type: ignore
        fastapiApp.add_api_route("/whoami", self.whoami, methods=["GET"])  # type: ignore

    async def register_user(self, register_data: RegisterUserData):
        user = self.user_storage.create_new_user(register_data.name)
        return user

    async def whoami(self, player_id: str):

        try:
            user = self.user_storage.get_user_by_id(player_id)
        except KeyError:
            raise HTTPException(404, "User not found")

        return user


f = UserManager()

f.ssig
