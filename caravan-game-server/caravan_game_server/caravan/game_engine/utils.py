import random
from typing import List, TypeVar

from caravan_game_server.caravan.game_engine.model import (
    CARAVAN_NAMES,
    POINT_MAP,
    Card,
    Rank,
    Suit,
)


def generate_random_caravan_names(count: int):
    names_pool = CARAVAN_NAMES.copy()
    random.shuffle(names_pool)

    return names_pool[0:count]


def generate_whole_deck(count=54):
    deck: List[Card] = []
    current_count = 0

    for suit in Suit:
        for rank in Rank:
            if current_count >= count:
                return deck

            deck.append(Card(suit=suit, rank=rank))
            current_count += 1

    random.shuffle(deck)

    return deck


def get_random_cards_from_deck(deck: List[Card], count: int):
    output: List[Card] = []
    for i in range(count):
        card = deck.pop(random.randint(0, len(deck) - 1))
        output.append(card)

    new_cards = deck[0:count]

    return (new_cards, deck[count:])


def check_is_point_card(card: Card):
    if POINT_MAP[card.rank] != 0:
        return True

    return False


T = TypeVar("T")


def get_last_element(list: List[T]) -> T | None:
    try:
        return list[-1]
    except IndexError:
        return None
