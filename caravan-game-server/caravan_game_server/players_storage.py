import os
from uuid import uuid4
from caravan_game_server.model.user import User
from pydantic import ValidationError, TypeAdapter


TUserStorage = dict[str, User]

user_storage_path = "./users.json"
user_storage: TUserStorage = {}
userStorageModel = TypeAdapter(TUserStorage)


class UserStorage:
    def __init__(self, storage_path: str):
        self.storage_path = storage_path
        self.storage: TUserStorage = {}

    def __save_storage(self, storage: TUserStorage):
        with open(self.storage_path, mode="wb") as file:
            data = userStorageModel.dump_json(storage)
            file.write(data)

    def open_user_storage(self) -> TUserStorage:
        data = {}

        try:
            with open(self.storage_path, mode="rb") as file:
                data = userStorageModel.validate_json(file.read())
        except (FileNotFoundError, ValidationError) as e:
            self.__save_storage({})

        return data

    def load_storage(self):
        storage = self.open_user_storage()
        self.storage = storage

    def save_storage(self):
        self.__save_storage(self.storage)

    def get_user_by_id(self, user_id: str) -> User | None:
        self.load_storage()
        
        return self.storage[user_id]

    def create_new_user(self, name: str) -> User:
        user = User(id=str(uuid4()), name=name)

        self.storage[user.id] = user
        self.save_storage()

        return user
