import random
from typing import Callable, List, TypeVar

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


def extract_linked_cards_indexes(cards_list: List[Card], card_index: int) -> list[int]:
    def move_left(prev_card_index: int):
        if prev_card_index < 0:
            return None

        if check_is_point_card(cards_list[prev_card_index]):
            return None

        if prev_card_index - 1 < 0:
            return None

        return prev_card_index - 1

    def move_right(prev_card_index: int):
        current_index = prev_card_index + 1

        if current_index >= len(cards_list):
            return None

        if check_is_point_card(cards_list[current_index]):
            return None

        return current_index

    def traverse_left(init_index: int) -> list[int]:
        prev_index = init_index

        output: list[int] = []
        while (result := move_left(prev_index)) != None:
            output.append(result)
            prev_index -= 1

        return output

    def traverse_right(init_index: int) -> list[int]:
        prev_index = init_index

        output: list[int] = []
        while (result := move_right(prev_index)) != None:
            output.append(result)
            prev_index += 1

        return output

    if card_index >= len(cards_list):
        return []

    remove_left: list[int] = traverse_left(card_index)
    remove_right: list[int] = traverse_right(card_index)

    output = remove_left + [card_index] + remove_right
    output.sort()
    return output
