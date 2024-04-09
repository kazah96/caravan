import json
from typing import Dict, List
from enum import Enum


class Suit(Enum):
    HEARTS = "Hearts"
    DIAMONDS = "Diamonds"
    CLUBS = "Clubs"
    SPADES = "Spades"


class Rank(Enum):
    ACE = "Ace"
    TWO = "2"
    THREE = "3"
    FOUR = "4"
    FIVE = "5"
    SIX = "6"
    SEVEN = "7"
    EIGHT = "8"
    NINE = "9"
    TEN = "10"
    JACK = "Jack"
    QUEEN = "Queen"
    KING = "King"


class PlayerMove(Enum):
    PUT_CARD = "put_card"


class Card:
    def __init__(self, suit, rank):
        self.suit = suit
        self.rank = rank

    def __str__(self):
        return f"{self.rank.value} of {self.suit.value}"


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
