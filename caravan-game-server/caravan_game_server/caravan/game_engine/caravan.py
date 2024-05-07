from enum import Enum
from typing import Any, Optional
from caravan_game_server.caravan.game_engine.model import (
    POINT_MAP,
    Caravan,
    Card,
    Direction,
    Rank,
)


from caravan_game_server.caravan.game_engine.settings import (
    CARAVAN_SALE_MAX,
    CARAVAN_SALE_MIN,
)
from caravan_game_server.caravan.game_engine.utils import (
    check_is_point_card,
    extract_linked_cards_indexes,
    get_last_element,
)
from caravan_game_server.caravan.game_engine.model import PlayerSides


def remove_elements(original_list: list[Any], remove_indexes: list[int]):
    copied_list = original_list.copy()
    # Sort the indexes in descending order to avoid index shifting when removing elements
    remove_indexes.sort(reverse=True)

    # Remove elements from the original list based on the indexes provided
    for index in remove_indexes:
        if 0 <= index < len(copied_list):
            del copied_list[index]

    return copied_list


def remove_card_with_linked(cards: list[Card], index: int):
    linked_card_indexes = extract_linked_cards_indexes(cards, index)
    
    return remove_elements(cards, linked_card_indexes)


class CaravanNumber(Enum):
    ONE = 0
    TWO = 1
    THREE = 2


class CaravanImplementation(Caravan):
    which: PlayerSides
    cards: list[Card] = []
    current_direction: Optional[Direction] = None
    name: str = ""
    type: CaravanNumber

    last_caravan_point_card: Optional[Card] = None
    last_caravan_card: Optional[Card] = None

    def insert_card(self, card: Card, index=None):
        is_point_card = check_is_point_card(card)

        match card.rank:
            case (
                Rank.ACE
                | Rank.TWO
                | Rank.THREE
                | Rank.FOUR
                | Rank.FIVE
                | Rank.SIX
                | Rank.SEVEN
                | Rank.EIGHT
                | Rank.NINE
                | Rank.TEN
            ):
                self.last_caravan_point_card = card
                self.cards.append(card)
            case Rank.JACK:
                index = index if index != None else len(self.cards) - 1

                if index >= len(self.cards):
                    index -= 1

                self.cards = remove_card_with_linked(self.cards, index)

            case Rank.QUEEN:
                self.current_direction = (
                    Direction.ASCENDING
                    if self.current_direction == Direction.DESCENDING
                    else Direction.DESCENDING
                )
                self.cards.append(card)

            case Rank.KING:
                if index == None:
                    self.cards.append(card)
                else:
                    self.cards.insert(index + 1, card)

    def clear_caravan(self):
        self.cards = []
        self.last_caravan_card = None
        self.last_caravan_point_card = None

    def count_points(self):
        points_list: list[int] = []

        for index, card in enumerate(self.cards):
            if check_is_point_card(card):
                points_list.append(POINT_MAP[card.rank])

            if card.rank == Rank.KING:
                points_list[len(points_list) - 1] *= 2

        return sum(points_list)

    def is_in_bounds(self):
        points = self.count_points()
        return points >= CARAVAN_SALE_MIN and points < CARAVAN_SALE_MAX

    def __str__(self) -> str:
        return f"{self.which.value}'s hand: {self.cards}"

    def __json__(self):
        return {
            "which": self.which.value,
            "name": self.name,
            "cards": self.cards,
            "current_direction": (
                self.current_direction.value if self.current_direction != None else None
            ),
        }
