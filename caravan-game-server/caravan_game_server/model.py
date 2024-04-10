from __future__ import annotations
from enum import Enum
import json
import json_fix


class Suit(Enum):
    HEARTS = "HEARTS"
    DIAMONDS = "DIAMONDS"
    CLUBS = "CLUBS"
    SPADES = "SPADES"


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


class PlayerMove(Enum):
    PUT_CARD = "put_card"


class Card:
    def __init__(self, suit: Suit, rank: Rank):
        self.suit = suit
        self.rank = rank

    def __eq__(self, value: Card) -> bool:
        return self.rank == value.rank and self.suit == value.suit

    def __str__(self):
        return f"{self.rank.value}{self.suit.value}"

    def __json__(self):
        return {"rank": self.rank.name, "suit": self.suit.name}
