from caravan_game_server.caravan.game_engine.model import Card, Rank, Suit
from caravan_game_server.caravan.game_engine.utils import extract_linked_cards_indexes
import pytest


def test_extract():
    cards = [
        Card(suit=Suit.CLUBS, rank=Rank.FOUR),
        Card(suit=Suit.CLUBS, rank=Rank.FIVE),
        Card(suit=Suit.CLUBS, rank=Rank.TEN),
        Card(suit=Suit.CLUBS, rank=Rank.KING),
        Card(suit=Suit.CLUBS, rank=Rank.KING),
    ]

    t = extract_linked_cards_indexes(cards, 2)

    assert t == [2, 3, 4]

    t = extract_linked_cards_indexes(cards, 3)

    assert t == [2, 3, 4]

    t = extract_linked_cards_indexes(cards, 4)
    assert t == [2, 3, 4]


    t = extract_linked_cards_indexes(cards, 1)
    assert t == [1]

    t = extract_linked_cards_indexes(cards, 0)
    assert t == [0]

    t = extract_linked_cards_indexes(cards, 123)
    assert t == []

