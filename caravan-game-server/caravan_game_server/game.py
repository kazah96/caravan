import json
from typing import Dict, List
from enum import Enum


class PlayerManager:
    def __init__(self) -> None:
        self.handlers = {}

        pass

    def handle_message(self, message: str):
        data = json.loads(message)
        handler = self.handlers[data["type"]]

        print(handler)

        if handler:
            payload = data["payload"]
            handler(payload)

    def onevent(self, command_name: str, callback):
        self.handlers[command_name] = callback


class Game:
    def __init__(self, player_manager: PlayerManager) -> None:
        self.player_manager = player_manager

        player_manager.onevent("command", self.handle_command)

        self.player1StorageCards: List[Card] = []
        self.player2StorageCards: List[Card] = []

        self.player1Hand: List[Card] = []
        self.player2Hand: List[Card] = []

        self.caravans: Dict[str, List[Card]] = {"t": [], "f": [], "g": []}

    def handle_command(self, data):
        print("HandleCOmmand, ", data)

    def player_move(self, move: PlayerMove, options):
        match move:
            case PlayerMove.PUT_CARD:
                print("PUT_CARD")
