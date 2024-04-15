from __future__ import annotations

from typing import Dict, Optional
from caravan_game_server.caravan.game_match import CaravanGameMatch
from caravan_game_server.caravan.player import CaravanPlayer, NetworkPlayer
from caravan_game_server.model.network import NetworkPayload
from caravan_game_server.model.user import User
from caravan_game_server.network.network_player import NetworkPlayer
from caravan_game_server.network.socket import sio
from socketio import exceptions


players: Dict[str, NetworkPlayer] = {}

games = {}


class GameManager:
    def __init__(self) -> None:
        game: Optional[CaravanGameMatch] = None

    def new_game(self, player1: NetworkPlayer, player2: NetworkPlayer):
        self.game = CaravanGameMatch(player1, player2)
        self.game.on_game_closed.connect(self._handle_game_stop)

    def _handle_game_stop(self, *args, **kwargs):
        del self.game


manager = GameManager()


@sio.event
def connect(sid: str, environ):
    if len(players) == 2:
        return False

    players[sid] = NetworkPlayer(sid, User(name="sdf", id="sdf"))

    if len(players) == 2:
        player1, player2 = list(players.values())
        manager.new_game(player1, player2)


@sio.event
def connect_error(*args, **kwargs):
    print("The connection failed!")


@sio.event
def disconnect(sid: str):
    players[sid].on_disconnect()
    del players[sid]

    print(players)
    print("I'm disconnected!")


@sio.on("message")  # type: ignore
async def message(sid, data):
    payload = NetworkPayload.model_validate_json(data)
    players[sid].on_message(payload)
