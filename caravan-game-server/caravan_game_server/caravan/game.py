import asyncio
import datetime
from enum import Enum
from typing import Optional
import anyio
from blinker import Signal
from caravan_game_server.caravan.game_engine.commands import (
    CaravanCommand,
    DropCaravanCommand,
    DropCardCommand,
    PutCardCommand,
)
from caravan_game_server.caravan.game_engine.engine import GameEngine
from caravan_game_server.caravan.game_engine.model import CaravanState
from caravan_game_server.caravan.game_engine.model import PlayerSides
from caravan_game_server.caravan.model import (
    CaravanDiscardCaravanRequest,
    CaravanDiscardCardRequest,
    CaravanPutCardRequest,
)
from fastapi import HTTPException
from caravan_game_server.users.players_storage import storage as user_storage


class GameState(Enum):
    WAITING = 0
    IN_GAME = 1
    PLAYER_1_WON = 2
    PLAYER_2_WON = 3
    CLOSED = 4


class Game:
    on_game_closed = Signal()
    on_game_winner = Signal()

    def __init__(
        self, game_name: Optional[str], created_at: datetime.datetime, is_private=True
    ):
        self.is_private = is_private
        self.game_name = game_name
        self.joined_players: dict[PlayerSides, str] = {}
        self.state: GameState = GameState.WAITING
        self.game = GameEngine()
        self.created_at = created_at
        self.players_wanna_rematch: dict[PlayerSides, bool] = {
            PlayerSides.PLAYER_1: False,
            PlayerSides.PLAYER_2: False,
        }

        self._update_subscribers: list[asyncio.Event] = []

    def get_winner_user_id(self):
        if self.game.game_state == CaravanState.PLAYER_1_WON:
            return self.joined_players[PlayerSides.PLAYER_1]
        if self.game.game_state == CaravanState.PLAYER_2_WON:
            return self.joined_players[PlayerSides.PLAYER_2]

    def get_loser_user_id(self):
        if self.game.game_state == CaravanState.PLAYER_1_WON:
            return self.joined_players[PlayerSides.PLAYER_2]
        if self.game.game_state == CaravanState.PLAYER_2_WON:
            return self.joined_players[PlayerSides.PLAYER_1]

    def is_game_active(self):
        return self.state == GameState.IN_GAME

    def _init_game(self):
        self.game.init_game()
        self.state = GameState.IN_GAME
        self._notify_subscribers()

    def player_request_rematch(self, player_id: str):
        player_side = self._get_side_by_player_id(player_id)
        self.players_wanna_rematch[player_side] = True

        if list(self.players_wanna_rematch.values()) == [True, True]:
            self._init_rematch()

    def _init_rematch(self):
        self.players_wanna_rematch = {
            PlayerSides.PLAYER_1: False,
            PlayerSides.PLAYER_2: False,
        }
        self._get_game_instance().init_game(is_rematch=True)
        self.state = GameState.IN_GAME
        self._update()

    def _get_game_instance(self):
        if self.game is None:
            raise ValueError("Game not initialized")

        return self.game

    def _get_side_by_player_id(self, player: str):
        for side, player_id in self.joined_players.items():
            if player_id == player:
                return side

        raise KeyError("Player not in game")

    def _update(self):
        new_state = self._get_game_instance().get_game_state_data()

        if new_state.state == CaravanState.PLAYER_1_WON:
            self.state = GameState.PLAYER_1_WON
        if new_state.state == CaravanState.PLAYER_2_WON:
            self.state = GameState.PLAYER_2_WON

        self._notify_subscribers()

        if new_state.state in [CaravanState.PLAYER_1_WON, CaravanState.PLAYER_2_WON]:
            self.on_game_winner.send(self)
            anyio.run(self._close_with_delay)

    async def _close_with_delay(self):
        await asyncio.sleep(11)
        if self.state == GameState.IN_GAME:
            return

        self._handle_close_game()

    def _handle_close_game(self):
        if self.state == GameState.CLOSED:
            return

        self.state = GameState.CLOSED
        self._notify_subscribers()
        self.on_game_closed.send(self)

    def _notify_subscribers(self):
        for subscriber in self._update_subscribers:
            subscriber.set()

    def _make_move(self, player_id: str, command: CaravanCommand):
        side = self._get_side_by_player_id(player_id)

        self._get_game_instance().make_turn(side, command)
        self._update()

    def get_game_state(self, user_id: str):
        current_player_side = self._get_side_by_player_id(user_id)

        if self.state == GameState.WAITING:
            return {"state": GameState.WAITING}
        else:
            enemy_side = current_player_side.other_side()
            enemy_id = self.joined_players[enemy_side]
            enemy = user_storage.get_user_by_id(enemy_id)

            return {
                "state": self.state,
                "enemy": enemy,
                "data": self._get_game_instance().get_game_state_data(),
                "logs": self._get_game_instance().logs,
            }

    def join_player(self, player_id: str):
        if player_id in self.get_joined_players_ids():
            for side, player in self.joined_players.items():
                if player == player_id:
                    return side

        if len(self.joined_players) == 1:
            self.joined_players[PlayerSides.PLAYER_2] = player_id

            self._init_game()

            return PlayerSides.PLAYER_2

        if len(self.joined_players) == 0:
            self.joined_players[PlayerSides.PLAYER_1] = player_id

            return PlayerSides.PLAYER_1

        raise ValueError("Game is full")

    def get_joined_players_ids(self) -> list[str]:
        return list(self.joined_players.values())

    def put_card(self, player_id: str, data: CaravanPutCardRequest):
        self._make_move(
            player_id,
            PutCardCommand(
                caravan_name=data.caravan_name,
                card=data.card,
                card_in_caravan=data.card_in_caravan,
            ),
        )

    def discard_caravan(self, player_id: str, data: CaravanDiscardCaravanRequest):
        self._make_move(player_id, DropCaravanCommand(data.caravan_name))

    def discard_card(self, player_id: str, data: CaravanDiscardCardRequest):
        self._make_move(player_id, DropCardCommand(data.card))

    async def subscribe_to_updates(self, user_id: str):
        event = asyncio.Event()
        self._update_subscribers.append(event)

        try:
            await asyncio.wait_for(event.wait(), 30)
        except TimeoutError as e:
            pass

        if self.state == GameState.CLOSED:
            raise HTTPException(403, "Game has been closed")

        self._update_subscribers.remove(event)

        return self.get_game_state(user_id)
