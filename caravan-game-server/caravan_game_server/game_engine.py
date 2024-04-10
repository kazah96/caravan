from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
import json
import random
from typing import Dict, List, TypeVar, Union
from caravan_game_server.model import Card, Rank, Suit


CARAVAN_SALE_MIN = 21
CARAVAN_SALE_MAX = 27

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


class GameState(Enum):
    PLAYING = 0
    PLAYER_1_WON = 1
    PLAYER_2_WON = 2


def generate_whole_deck(count=54):
    deck: List[Card] = []
    current_count = 0

    for suit in Suit:
        for rank in Rank:
            if current_count >= count:
                return deck

            deck.append(Card(suit, rank))
            current_count += 1

    random.shuffle(deck)

    return deck

HAND_SIZE = 6
FULL_DECK = generate_whole_deck()


def get_random_cards_from_deck(deck: List[Card], count: int):
    output: List[Card] = []
    for i in range(count):
        card = deck.pop(random.randint(0, len(deck) - 1))
        output.append(card)

    new_cards = deck[0:count]

    return (new_cards, deck[count:])


class Players(str, Enum):
    PLAYER_1 = "player1"
    PLAYER_2 = "player2"


class Direction(Enum):
    ASCENDING = "ascending"
    DESCENDING = "descending"


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


@dataclass
class Caravan:
    which: Players
    cards: list[Card] = field()
    current_direction: Union[Direction, None] = None
    name: str = ""

    def insert_card(self, card: Card, index=None):
        is_point_card = check_is_point_card(card)
        last_caravan_card = get_last_element(self.cards)

        if is_point_card:
            if index != None:
                raise ValueError("Point cards can't be inserted into a position")

            if not last_caravan_card is None:
                if last_caravan_card.suit == card.suit:
                    pass
                elif (
                    self.current_direction == Direction.ASCENDING
                    and POINT_MAP[last_caravan_card.rank] > POINT_MAP[card.rank]
                ):
                    raise ValueError("Card is lower than last, in ascending")
                elif (
                    self.current_direction == Direction.DESCENDING
                    and POINT_MAP[last_caravan_card.rank] < POINT_MAP[card.rank]
                ):
                    raise ValueError("Card is greater than last, in descending")

                self.current_direction = (
                    Direction.ASCENDING
                    if POINT_MAP[last_caravan_card.rank] < POINT_MAP[card.rank]
                    else Direction.DESCENDING
                )

        if card.rank == Rank.QUEEN:
            self.current_direction = (
                Direction.ASCENDING
                if self.current_direction == Direction.DESCENDING
                else Direction.DESCENDING
            )

        if card.rank == Rank.JACK:
            index = index if index != None else len(self.cards) - 1

            self.cards.pop(index)

        if index == None:
            self.cards.append(card)
        else:
            self.cards.insert(index, card)

    def count_points(self):
        points_list: list[int] = []

        for index, card in enumerate(self.cards):
            if check_is_point_card(card):
                points_list.append(POINT_MAP[card.rank])

            if card.rank == Rank.KING:
                points_list[len(points_list) - 1] *= 2

        return sum(points_list)

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


class GameEngine:
    def __init__(self) -> None:
        self.player_turn = Players.PLAYER_1
        self.caravans: Dict[str, Caravan] = {}
        self.current_hands: Dict[Players, List[Card]] = {}
        self.decks: Dict[Players, List[Card]] = {}

    def show_caravans(self):
        for key, value in self.caravans.items():
            print(f"{key} {value.count_points()}")
            print(" ".join([str(v) for v in value.cards]))
            print("______")

    def init_player(self, player: Players):
        hand, deck = get_random_cards_from_deck(generate_whole_deck(), HAND_SIZE)
        self.decks[player] = deck
        self.current_hands[player] = hand

    def init_game(self):
        self.caravans["player1_caravan1"] = Caravan(
            Players.PLAYER_1, [], name="player1_caravan1"
        )
        self.caravans["player1_caravan2"] = Caravan(
            Players.PLAYER_1, [], name="player1_caravan2"
        )
        self.caravans["player1_caravan3"] = Caravan(
            Players.PLAYER_1, [], name="player1_caravan3"
        )

        self.caravans["player2_caravan1"] = Caravan(
            Players.PLAYER_2, [], name="player2_caravan1"
        )
        self.caravans["player2_caravan2"] = Caravan(
            Players.PLAYER_2, [], name="player2_caravan2"
        )
        self.caravans["player2_caravan3"] = Caravan(
            Players.PLAYER_2, [], name="player2_caravan3"
        )

        self.init_player(Players.PLAYER_1)
        self.init_player(Players.PLAYER_2)

        self.player_turn = Players.PLAYER_1

    def make_turn(self, command: Command):
        command.execute(self)
        self.player_turn = (
            Players.PLAYER_1
            if self.player_turn == Players.PLAYER_2
            else Players.PLAYER_2
        )


class Command(ABC):
    def __init__(self) -> None:
        pass

    @abstractmethod
    def execute(self, game_instance: GameEngine):
        pass


class PutCardCommand(Command):
    def __init__(
        self, card: Card, caravan_name: str, card_in_caravan: Card | None
    ) -> None:
        self.card = card
        self.card_in_caravan = card_in_caravan
        self.caravan_name = caravan_name

    def execute(self, game_instance: GameEngine):
        caravan = game_instance.caravans[self.caravan_name]

        match self.card.rank:
            case Rank.JACK:
                print("Jack")
            case _:
                caravan.insert_card(self.card)
                print("Other")

        current_player = game_instance.player_turn

        index_in_hand = game_instance.current_hands[current_player].index(self.card)

        game_instance.current_hands[current_player].pop(index_in_hand)
        new_card = game_instance.decks[current_player].pop()
        game_instance.current_hands[current_player].append(new_card)


if __name__ == "__main__":
    engine = GameEngine()
    engine.init_game()

    engine.show_caravans()
    print(engine.caravans)
    print(engine.caravans)
