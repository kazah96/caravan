from typing import Optional, Union
from caravan_game_server.caravan.game_engine.model import (
    POINT_MAP,
    Caravan,
    Card,
    Direction,
    Rank,
)


from caravan_game_server.caravan.game_engine.utils import (
    check_is_point_card,
    get_last_element,
)
from caravan_game_server.caravan.model import PlayerSides


class CaravanImplementation(Caravan):
    which: PlayerSides
    cards: list[Card] = []
    current_direction: Optional[Direction] = None
    name: str = ""

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
                if self.last_caravan_point_card:
                    if self.last_caravan_point_card.suit == card.suit:
                        pass
                    elif (
                        self.current_direction == Direction.ASCENDING
                        and POINT_MAP[self.last_caravan_point_card.rank]
                        > POINT_MAP[card.rank]
                    ):
                        raise ValueError("Card is lower than last, in ascending")
                    elif (
                        self.current_direction == Direction.DESCENDING
                        and POINT_MAP[self.last_caravan_point_card.rank]
                        < POINT_MAP[card.rank]
                    ):
                        raise ValueError("Card is greater than last, in descending")

                    self.current_direction = (
                        Direction.ASCENDING
                        if POINT_MAP[self.last_caravan_point_card.rank]
                        < POINT_MAP[card.rank]
                        else Direction.DESCENDING
                    )

                self.last_caravan_point_card = card
                self.cards.append(card)
            case Rank.JACK:
                index = index if index != None else len(self.cards) - 1
                if len(self.cards) >= index - 1:
                    self.cards.pop(index)
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
