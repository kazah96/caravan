from caravan_game_server.model.user import User
from caravan_game_server.players_storage import UserStorage
import os


def prelude() -> UserStorage:
    filename = "./test_users.json"

    try:
        os.remove(filename)
    except FileNotFoundError as e:
        pass

    return UserStorage(filename)


def test_open_and_close():
    userStorage = prelude()

    assert userStorage.open_user_storage() == {}

    storage = {"user1": User(id="user1", name="Ivan")}

    userStorage.storage = storage

    userStorage.save_storage()

    assert userStorage.open_user_storage() == storage


def test_creating_new_user():
    userStorage = prelude()

    assert userStorage.open_user_storage() == {}

    user = userStorage.create_new_user(name="Ivan")
    id = user.id
    t = {id: user}

    assert userStorage.open_user_storage() == t
