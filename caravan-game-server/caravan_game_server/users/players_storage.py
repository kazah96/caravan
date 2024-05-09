from datetime import datetime
from caravan_game_server.users.crypto import verify_password
from caravan_game_server.db.db import User as UserDBModel, UserGame
from caravan_game_server.users.model import User
from peewee import DoesNotExist, fn, JOIN


class UserAlreadyExists(Exception):
    pass


class UserStorage:
    def get_user_by_id(self, user_id: str) -> User | None:
        try:
            user_from_db = UserDBModel.get_by_id(pk=user_id)
            user = User(id=user_from_db.id, name=user_from_db.name)
            return user
        except DoesNotExist:
            return None

    def create_new_user(self, name: str, hashed_password: str) -> User:
        try:
            UserDBModel.get(UserDBModel.name == name)
            raise UserAlreadyExists()
        except DoesNotExist:
            pass

        u = UserDBModel.create(
            name=name,
            password=hashed_password,
            created_at=datetime.now(),
        )
        u.save()

        user = User(id=u.id, name=u.name)

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

    def authenticate_user(self, username: str, password: str) -> UserDBModel | None:
        try:
            user = UserDBModel.get(UserDBModel.name == username)
            result = verify_password(password, user.password)
            if result:
                return user
            else:
                return None

        except DoesNotExist:
            return None


storage = UserStorage()
