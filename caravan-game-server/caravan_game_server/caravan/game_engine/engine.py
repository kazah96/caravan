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
from caravan_game_server.caravan.game_engine.settings import (
    HAND_SIZE,
    INITIAL_HAND_SIZE,
)
from caravan_game_server.caravan.game_engine.utils import (
    generate_random_caravan_names,
    generate_whole_deck,
    get_random_cards_from_deck,
)
from caravan_game_server.caravan.model import PlayerSides

FULL_DECK = generate_whole_deck()


def get_caravans_by_player(caravans: Dict[str, Caravan], player: PlayerSides):
    return [caravan for caravan in caravans.values() if caravan.which == player]


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
        hand, deck = get_random_cards_from_deck(
            generate_whole_deck(), INITIAL_HAND_SIZE
        )
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

        command.execute(self)

        next_turn_player = (
            PlayerSides.PLAYER_1
            if self.player_turn == PlayerSides.PLAYER_2
            else PlayerSides.PLAYER_2
        )

        if self.get_total_cards_for_player(next_turn_player) != 0:
            self.player_turn = next_turn_player

        self.check_is_game_over()

    def get_total_cards_for_player(self, player: PlayerSides):
        return len(self.current_hands[player]) + len(self.decks[player])

    def check_win_for_players(self):
        player1_caravans = get_caravans_by_player(self.caravans, PlayerSides.PLAYER_1)
        player2_caravans = get_caravans_by_player(self.caravans, PlayerSides.PLAYER_2)

        caravan_scores = list(
            map(
                lambda caravans: [
                    caravan.count_points()
                    for caravan in caravans
                    if caravan.is_in_bounds()
                ],
                [player1_caravans, player2_caravans],
            )
        )

        if len(caravan_scores[0]) == 3:
            return CaravanState.PLAYER_1_WON
        if len(caravan_scores[1]) == 3:
            return CaravanState.PLAYER_2_WON

        are_players_dont_have_cards = self.get_total_cards_for_player(
            PlayerSides.PLAYER_1
        ) == 0 and self.get_total_cards_for_player(PlayerSides.PLAYER_2)

        if are_players_dont_have_cards:
            if len(caravan_scores[0]) == 2 and len(caravan_scores[1]) == 2:
                return (
                    CaravanState.PLAYER_1_WON
                    if sum(caravan_scores[0]) > sum(caravan_scores[1])
                    else CaravanState.PLAYER_2_WON
                )

            if len(caravan_scores[0]) == 2:
                return CaravanState.PLAYER_1_WON

            if len(caravan_scores[1]) == 2:
                return CaravanState.PLAYER_2_WON

    def check_is_game_over(self) -> Union[PlayerSides, None]:
        self.game_state = CaravanState.PLAYING

        winner = self.check_win_for_players()

        if winner:
            self.game_state = winner


if __name__ == "__main__":
    engine = GameEngine()
    engine.init_game()

    engine.show_caravans()
