from __future__ import annotations
import random
from typing import Dict, List, TypeVar, Union
from caravan_game_server.caravan.game_engine.caravan import CaravanImplementation
from caravan_game_server.caravan.game_engine.commands import CaravanCommand
from caravan_game_server.caravan.game_engine.model import (
    CARAVAN_NAMES,
    Caravan,
    Card,
    GameState,
    GameStateData,
    Rank,
    Suit,
)
from caravan_game_server.caravan.game_engine.settings import HAND_SIZE
from caravan_game_server.caravan.game_engine.utils import (
    generate_random_caravan_names,
    generate_whole_deck,
    get_random_cards_from_deck,
)
from caravan_game_server.caravan.model import PlayerSides

FULL_DECK = generate_whole_deck()


class GameEngine:
    def __init__(self) -> None:
        self.player_turn = PlayerSides.PLAYER_1
        self.caravans: Dict[str, Caravan] = {}
        self.current_hands: Dict[PlayerSides, List[Card]] = {}
        self.decks: Dict[PlayerSides, List[Card]] = {}
        self.game_state = GameState.PLAYING

    def get_game_state_data(self, player_side: PlayerSides):
        game_state_data = GameStateData(
            current_player=player_side,
            hands=self.current_hands,
            decks=self.decks,
            current_turn=self.player_turn,
            state=self.game_state,
            caravans=self.caravans,
        )

        return game_state_data

    def show_caravans(self):
        for key, value in self.caravans.items():
            print(f"{key} {value.count_points()}")
            print(" ".join([str(v) for v in value.cards]))
            print("______")

    def init_player(self, player: PlayerSides):
        hand, deck = get_random_cards_from_deck(generate_whole_deck(), HAND_SIZE)
        self.decks[player] = deck
        self.current_hands[player] = hand

 

    def init_game(self):
        caravan_names = generate_random_caravan_names(6)


        for player_side in [PlayerSides.PLAYER_1, PlayerSides.PLAYER_2]:
            for _ in range(3):
                caravan_name = caravan_names.pop()
                self.caravans[caravan_name] = CaravanImplementation(
                    which=player_side, cards=[], name=caravan_name
                )

        self.init_player(PlayerSides.PLAYER_1)
        self.init_player(PlayerSides.PLAYER_2)

        self.player_turn = PlayerSides.PLAYER_1

    def make_turn(self, player: PlayerSides, command: "CaravanCommand"):
        print("making turn")
        if player != self.player_turn:
            print("Not your turn")
            return
            # raise ValueError("Not your turn")

        command.execute(self)

        self.player_turn = (
            PlayerSides.PLAYER_1
            if self.player_turn == PlayerSides.PLAYER_2
            else PlayerSides.PLAYER_2
        )

        self.check_is_game_over()

    def check_is_game_over(self) -> Union[PlayerSides, None]:
        self.game_state = GameState.PLAYING


if __name__ == "__main__":
    engine = GameEngine()
    engine.init_game()

    engine.show_caravans()
    print(engine.caravans)
    print(engine.caravans)
