from __future__ import annotations
import random
from typing import Dict, List, Optional, TypeVar, Union
from caravan_game_server.caravan.game_engine.caravan import (
    CaravanImplementation,
    CaravanNumber,
)
from caravan_game_server.caravan.game_engine.commands import CaravanCommand
from caravan_game_server.caravan.game_engine.model import (
    Caravan,
    Card,
    CaravanState,
    GameStateData,
)
from caravan_game_server.caravan.game_engine.settings import HAND_SIZE, INITIAL_HAND_SIZE
from caravan_game_server.caravan.game_engine.utils import (
    generate_random_caravan_names,
    generate_whole_deck,
    get_random_cards_from_deck,
)
from caravan_game_server.caravan.model import PlayerSides

FULL_DECK = generate_whole_deck()


def get_caravans_by_player(caravans: Dict[str, Caravan], player: PlayerSides):
    return [caravan for caravan in caravans.values() if caravan.which == player]


def count_win_for_player(winners: list[PlayerSides], player_side: PlayerSides):
    arr = list(filter(lambda side: side == player_side, winners))
    t = len(arr) >= 2
    return t


class GameEngine:
    def __init__(self) -> None:
        self.move_counter = 0
        self.player_turn = PlayerSides.PLAYER_1
        self.caravans: Dict[str, Caravan] = {}
        self.current_hands: Dict[PlayerSides, List[Card]] = {}
        self.decks: Dict[PlayerSides, List[Card]] = {}
        self.game_state = CaravanState.PLAYING

    def get_game_state_data(self):
        game_state_data = GameStateData(
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
        hand, deck = get_random_cards_from_deck(generate_whole_deck(), INITIAL_HAND_SIZE)
        self.decks[player] = deck
        self.current_hands[player] = hand

    def init_game(self):
        caravan_names = generate_random_caravan_names(6)

        for player_side in [PlayerSides.PLAYER_1, PlayerSides.PLAYER_2]:
            for number in range(3):
                caravan_name = caravan_names.pop()
                self.caravans[caravan_name] = CaravanImplementation(
                    which=player_side,
                    cards=[],
                    name=caravan_name,
                    type=CaravanNumber(number),
                )

        self.init_player(PlayerSides.PLAYER_1)
        self.init_player(PlayerSides.PLAYER_2)

        self.player_turn = PlayerSides.PLAYER_1

    def make_turn(self, player: PlayerSides, command: "CaravanCommand"):
        self.move_counter += 1
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
        def get_caravan_by_number(n: CaravanNumber, caravans: list[Caravan]):
            for caravan in caravans:
                if caravan.type == n:  # type: ignore
                    return caravan

            return caravans[0]

        self.game_state = CaravanState.PLAYING

        player1_caravans = get_caravans_by_player(self.caravans, PlayerSides.PLAYER_1)
        player2_caravans = get_caravans_by_player(self.caravans, PlayerSides.PLAYER_2)

        data = {
            CaravanNumber.ONE: [
                get_caravan_by_number(CaravanNumber.ONE, player1_caravans),
                get_caravan_by_number(CaravanNumber.ONE, player2_caravans),
            ],
            CaravanNumber.TWO: [
                get_caravan_by_number(CaravanNumber.TWO, player1_caravans),
                get_caravan_by_number(CaravanNumber.TWO, player2_caravans),
            ],
            CaravanNumber.THREE: [
                get_caravan_by_number(CaravanNumber.THREE, player1_caravans),
                get_caravan_by_number(CaravanNumber.THREE, player2_caravans),
            ],
        }

        winners: list[PlayerSides] = []

        for caravan_number, (player_1_caravan, player_2_caravan) in data.items():
            p1points = player_1_caravan.count_points()
            p2points = player_1_caravan.count_points()

            if player_1_caravan.is_in_bounds():
                if player_2_caravan.is_in_bounds():
                    if p1points > p2points:
                        winners.append(PlayerSides.PLAYER_1)
                    else:
                        winners.append(PlayerSides.PLAYER_2)
                else:
                    winners.append(PlayerSides.PLAYER_1)

            elif player_2_caravan.is_in_bounds():
                winners.append(PlayerSides.PLAYER_2)

        if count_win_for_player(winners, PlayerSides.PLAYER_1):
            self.game_state = CaravanState.PLAYER_1_WON
        if count_win_for_player(winners, PlayerSides.PLAYER_2):
            self.game_state = CaravanState.PLAYER_2_WON


if __name__ == "__main__":
    engine = GameEngine()
    engine.init_game()

    engine.show_caravans()
