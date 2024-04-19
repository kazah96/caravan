import datetime
from caravan_game_server.db.db import User as UserDBModel, UserGame
from caravan_game_server.users.model import User
from pydantic import ValidationError, TypeAdapter
from peewee import DoesNotExist, fn, JOIN

TUserStorage = dict[str, User]

user_storage: TUserStorage = {}
userStorageModel = TypeAdapter(TUserStorage)


class UserStorage:
    def __init__(self, storage_path: str):
        self.storage_path = storage_path
        self.storage: TUserStorage = {}

    def get_user_by_id(self, user_id: str) -> User | None:
        try:
            user_from_db = UserDBModel.get_by_id(pk=user_id)
            user = User(id=user_from_db.id, name=user_from_db.name)
            return user
        except DoesNotExist:
            return None

    def create_new_user(self, id: str, name: str) -> User:
        user = User(
            id=id,
            name=name,
        )

        u = UserDBModel.create(name=name, id=id, created_at=datetime.datetime.now())
        u.save()

        return user

    def get_users_stat(self):
        result_dict = {}

        result = (
            UserDBModel.select(
                UserDBModel.name,
                UserDBModel.id,
                UserGame.result,
                fn.COUNT(UserGame.result).alias("total"),
            )
            .join(UserGame, JOIN.LEFT_OUTER)
            .group_by(UserGame.result, UserDBModel.id)
            .dicts()
        )

        for item in result:
            current_user = result_dict.get(item["id"], {})
            current_user[item["result"]] = item["total"]
            current_user["name"] = item["name"]
            current_user["id"] = item["id"]

            result_dict[item["id"]] = current_user
        pass

        return list(result_dict.values())


USER_STORAGE_FILE = "./test_users.json"
storage = UserStorage(USER_STORAGE_FILE)

storage.get_users_stat()
