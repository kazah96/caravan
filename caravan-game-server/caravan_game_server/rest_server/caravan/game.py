import asyncio
import datetime
from enum import Enum
from telnetlib import GA
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
from caravan_game_server.caravan.model import PlayerSides
from caravan_game_server.rest_server.caravan.model import (
    CaravanDiscardCaravanRequest,
    CaravanDiscardCardRequest,
    CaravanPutCardRequest,
)
from fastapi import HTTPException


class GameState(Enum):
    WAITING = 0
    IN_GAME = 1
    PLAYER_1_WON = 2
    PLAYER_2_WON = 3
    CLOSED = 4


class Game:
    on_game_closed = Signal()

    def __init__(self, game_name: Optional[str]):
        self.game_name = game_name
        self.joined_players: dict[PlayerSides, str] = {}
        self.state: GameState = GameState.WAITING
        self.game = GameEngine()
        self.created_at = datetime.datetime.now()

        self._update_subscribers: list[asyncio.Event] = []

    def is_game_active(self):
        return self.state == GameState.IN_GAME

    def _init_game(self):
        self.game.init_player(PlayerSides.PLAYER_1)
        self.game.init_player(PlayerSides.PLAYER_2)
        self.game.init_game()
        self.state = GameState.IN_GAME
        self._notify_subscribers()


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
        if new_state == CaravanState.PLAYER_2_WON:
            self.state = GameState.PLAYER_2_WON

        self._notify_subscribers()

        if new_state.state in [CaravanState.PLAYER_1_WON, CaravanState.PLAYER_2_WON]:
            anyio.run(self._close_with_delay)


    async def _close_with_delay(self):
        await asyncio.sleep(5)
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

    def get_game_state(self):
        if self.state == GameState.WAITING:
            return {"state": GameState.WAITING}
        else:
            return {
                "state": self.state,
                "data": self._get_game_instance().get_game_state_data(),
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

    async def subscribe_to_updates(self):
        event = asyncio.Event()
        self._update_subscribers.append(event)

        try:
            await asyncio.wait_for(event.wait(), 30)
        except TimeoutError as e:
            pass

        if self.state == GameState.CLOSED:
            raise HTTPException(403, "Game has been closed")

        self._update_subscribers.remove(event)

        return self.get_game_state()
