from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional
from caravan_game_server.caravan.game_engine.model import (
    Card,
    Rank,
)
from pydantic import BaseModel


class ClientCommand(BaseModel, ABC):
    command_name: str

    @abstractmethod
    def construct_caravan_command(self) -> CaravanCommand:
        raise NotImplementedError("Not implemented")
        # return PutCardCommand(caravan_name='te')


class ClientPutCardCommand(BaseModel, ABC):
    class Data(BaseModel):
        card: Card
        caravan_name: str
        card_in_caravan: Optional[Card] = None

    command_name: str = "put_card"
    data: Data

    def construct_caravan_command(self):
        return PutCardCommand(
            card=self.data.card,
            caravan_name=self.data.caravan_name,
            card_in_caravan=self.data.card_in_caravan,
        )


class CaravanCommand(ABC):
    def __init__(self) -> None:
        pass

    @abstractmethod
    def execute(self, game_instance):
        pass


class PutCardCommand(CaravanCommand):
    def __init__(
        self, card: Card, caravan_name: str, card_in_caravan: Card | None
    ) -> None:
        self.card = card
        self.card_in_caravan = card_in_caravan
        self.caravan_name = caravan_name

    def execute(self, game_instance):
        caravan = game_instance.caravans[self.caravan_name]
        print("Execute command PutCardCommand")
   
        caravan.insert_card(self.card)

        current_player = game_instance.player_turn

        index_in_hand = game_instance.current_hands[current_player].index(self.card)

        game_instance.current_hands[current_player].pop(index_in_hand)
        new_card = game_instance.decks[current_player].pop()
        game_instance.current_hands[current_player].append(new_card)
