from __future__ import annotations
from abc import ABC, abstractmethod
from enum import Enum
from typing import Dict, List, Union

from pydantic import BaseModel, RootModel

# CARAVAN_NAMES = [
#     "Коттонвуд-Коув",
#     "Нельсон",
#     "Форт",
#     "Ред-Рок",
#     "Боулдер-сити",
#     "Дамба Гувера",
#     "Гудспрингс",
#     "Джейкобстаун",
#     "Ниптон",
#     "Примм",
#     "Новак",
# ]

CARAVAN_NAMES = [
    "Cottonwood",
    "Nelson",
    "Fort",
    "RedRock",
    "BoulderCity",
    "Dam",
    "Goodsprings",
    "Jacobstown",
    "Nipton",
    "Primm",
    "Novac",
]


class Caravan(BaseModel, ABC):
    which: PlayerSides
    cards: list[Card] = []
    current_direction: Union[Direction, None] = None
    name: str = ""

    @abstractmethod
    def insert_card(self, card: Card, index=None):
        pass

    @abstractmethod
    def count_points(self) -> int:
        pass

    @abstractmethod
    def is_in_bounds(self) -> bool:
        pass

    @abstractmethod
    def clear_caravan(self):
        pass


class Suit(Enum):
    HEARTS = "HEARTS"
    DIAMONDS = "DIAMONDS"
    CLUBS = "CLUBS"
    SPADES = "SPADES"


class Direction(Enum):
    ASCENDING = "ascending"
    DESCENDING = "descending"


class Rank(Enum):
    ACE = "ACE"
    TWO = "TWO"
    THREE = "THREE"
    FOUR = "FOUR"
    FIVE = "FIVE"
    SIX = "SIX"
    SEVEN = "SEVEN"
    EIGHT = "EIGHT"
    NINE = "NINE"
    TEN = "TEN"
    JACK = "JACK"
    QUEEN = "QUEEN"
    KING = "KING"


class PlayerSides(str, Enum):
    PLAYER_1 = "player1"
    PLAYER_2 = "player2"

    def other_side(self):
        return PlayerSides.PLAYER_1 if self == PlayerSides.PLAYER_2 else PlayerSides.PLAYER_2


class PlayerState(Enum):
    WAITING_FOR_GAME = "WAITING_FOR_GAME"
    IN_GAME = "IN_GAME"
    IN_LOBBY = "IN_LOBBY"


class PlayerMove(Enum):
    PUT_CARD = "put_card"


class CaravanState(Enum):
    PLAYING = 0
    PLAYER_1_WON = 1
    PLAYER_2_WON = 2


class Card(BaseModel):
    suit: Suit
    rank: Rank

    def __eq__(self, value: Card) -> bool:
        return self.rank == value.rank and self.suit == value.suit

    def __str__(self):
        return f"{self.rank.value}{self.suit.value}"

    def __json__(self):
        return {"rank": self.rank.name, "suit": self.suit.name}


class GameStateData(BaseModel):
    # current_player: PlayerSides
    state: CaravanState
    hands: Dict[PlayerSides, List[Card]]
    decks: Dict[PlayerSides, List[Card]]
    caravans: Dict[str, Caravan]
    current_turn: PlayerSides


POINT_MAP = {
    Rank.ACE: 1,
    Rank.TWO: 2,
    Rank.THREE: 3,
    Rank.FOUR: 4,
    Rank.FIVE: 5,
    Rank.SIX: 6,
    Rank.SEVEN: 7,
    Rank.EIGHT: 8,
    Rank.NINE: 9,
    Rank.TEN: 10,
    Rank.JACK: 0,
    Rank.QUEEN: 0,
    Rank.KING: 0,
}
