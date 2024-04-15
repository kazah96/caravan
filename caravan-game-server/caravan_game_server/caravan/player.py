from __future__ import annotations
from blinker import Signal

from abc import ABC, abstractmethod
from typing import Union
from blinker import signal
from caravan_game_server.caravan.game_engine.commands import (
    CaravanCommand,
    ClientCommand,
    ClientPutCardCommand,
)
from caravan_game_server.caravan.game_engine.model import GameStateData
from caravan_game_server.caravan.model import PlayerSides
from caravan_game_server.caravan.server_commands import (
    AcknowledgePlayerCommand,
    UpdateGameStateCommand,
)
from caravan_game_server.model.network import NetworkPayload
from caravan_game_server.network.network_player import NetworkPlayer
from pydantic import BaseModel, TypeAdapter, ValidationError


class CaravanPlayer:

    def __init__(self, network_player: NetworkPlayer) -> None:
        self.network_player = network_player
        self.network_player.on_recieved_message.connect(self._handle_recieve_message)
        self.network_player.on_disconnected.connect(self._handle_disconnected)

        self.on_recieve_command = Signal()
        """Sends (sender: Player, command: ClientCommand)"""

        self.on_disconnected = Signal()
        """Sends (sender: Player)"""

    def _handle_disconnected(self, sender: NetworkPlayer) -> None:
        self.on_disconnected.send(self)

    def notify_state_updated(self, state: GameStateData):
        self.network_player.send_message(UpdateGameStateCommand(payload=state))

    def acknowledge_player(self, player_side: PlayerSides):
        self.network_player.send_message(
            AcknowledgePlayerCommand(player_side=player_side)
        )

    def _handle_recieve_message(self, message: NetworkPayload):
        adapter = TypeAdapter(Union[ClientPutCardCommand, ClientPutCardCommand])
        print("handle_recieve_message")
        try:
            data: ClientCommand = adapter.validate_python(message.data)  # type: ignore
            self.on_recieve_command.send(self, command=data)
        except ValidationError as e:
            print("Malformed message", e)
            return
