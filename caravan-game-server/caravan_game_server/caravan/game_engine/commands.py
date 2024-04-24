from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Literal, Optional
from caravan_game_server.caravan.game_engine.model import (
    Card,
    Rank,
)
from caravan_game_server.caravan.game_engine.settings import HAND_SIZE
from pydantic import BaseModel


class ClientCommand(BaseModel, ABC):
    command_name: str

    @abstractmethod
    def construct_caravan_command(self) -> CaravanCommand:
        raise NotImplementedError("Not implemented")
        # return PutCardCommand(caravan_name='te')


class CaravanCommand(ABC):
    def __init__(self) -> None:
        pass

    @abstractmethod
    def execute(self, game_instance):
        pass


class ClientPutCardCommand(BaseModel, ABC):
    class Data(BaseModel):
        card: Card
        caravan_name: str
        card_in_caravan: Optional[int] = None

    command_name: Literal["put_card"] = "put_card"
    data: Data

    def construct_caravan_command(self):
        return PutCardCommand(
            card=self.data.card,
            caravan_name=self.data.caravan_name,
            card_in_caravan=self.data.card_in_caravan,
        )


class ClientDropCaravanCommand(BaseModel, ABC):
    class Data(BaseModel):
        caravan_name: str

    command_name: Literal["drop_caravan"] = "drop_caravan"
    data: Data

    def construct_caravan_command(self):
        return DropCaravanCommand(caravan_name=self.data.caravan_name)


class ClientDropCardCommand(BaseModel, ABC):
    class Data(BaseModel):
        card_in_hand: Card

    command_name: Literal["drop_card"] = "drop_card"
    data: Data

    def construct_caravan_command(self):
        return DropCardCommand(card=self.data.card_in_hand)


class PutCardCommand(CaravanCommand):
    def __init__(
        self, card: Card, caravan_name: str, card_in_caravan: int | None
    ) -> None:
        self.card = card
        self.card_in_caravan = card_in_caravan
        self.caravan_name = caravan_name

    def execute(self, game_instance):
        caravan = game_instance.caravans[self.caravan_name]
        print("Execute command PutCardCommand")

        caravan.insert_card(self.card, index=self.card_in_caravan)

        current_player = game_instance.player_turn

        index_in_hand = game_instance.current_hands[current_player].index(self.card)

        game_instance.current_hands[current_player].pop(index_in_hand)

        if (len(game_instance.current_hands[current_player]) < HAND_SIZE):
            new_card = game_instance.decks[current_player].pop()
            game_instance.current_hands[current_player].append(new_card)


class DropCaravanCommand(CaravanCommand):
    def __init__(self, caravan_name: str) -> None:
        self.caravan_name = caravan_name

    def execute(self, game_instance):
        game_instance.caravans[self.caravan_name].clear_caravan()


class DropCardCommand(CaravanCommand):
    def __init__(self, card: Card) -> None:
        self.card = card

    def execute(self, game_instance):
        current_player = game_instance.player_turn

        card_index = game_instance.current_hands[current_player].index(self.card)
        new_card = game_instance.decks[current_player].pop()
        game_instance.current_hands[current_player][card_index] = new_card
