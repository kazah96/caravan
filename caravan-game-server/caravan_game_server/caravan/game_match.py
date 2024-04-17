from enum import Enum
from blinker import Signal, signal
from caravan_game_server.caravan.player import CaravanPlayer
from caravan_game_server.caravan.game_engine.commands import (
    ClientCommand,
)
from caravan_game_server.caravan.game_engine.engine import GameEngine
from caravan_game_server.caravan.game_engine.model import CaravanState
from caravan_game_server.caravan.model import PlayerSides
from caravan_game_server.network.network_player import NetworkPlayer
from pydantic import BaseModel


class CaravanGameMatch:
    on_game_closed = Signal()

    def __init__(self, player1: NetworkPlayer, player2: NetworkPlayer):
        self.players: dict[PlayerSides, CaravanPlayer] = {
            PlayerSides.PLAYER_1: CaravanPlayer(player1),
            PlayerSides.PLAYER_2: CaravanPlayer(player2),
        }

        self.game_engine = GameEngine()
        self.is_active = False
        self._init_game()

    def _init_game(self):
        self.game_engine.init_game()

        for player_side, player in self.players.items():
            player.acknowledge_player(player_side)

            player.on_disconnected.connect(self.handle_player_disconnected)
            player.on_recieve_command.connect(self.recieve_command_from_player)
            player.notify_state_updated(self.game_engine.get_game_state_data(player_side))

        self.is_active = True

    def get_other_player(self, player: CaravanPlayer):
        return [
            other_player
            for other_player in self.players.values()
            if other_player != player
        ][0]

    def get_player_side_by_player(self, player: CaravanPlayer):
        for key, value in self.players.items():
            if value == player:
                return key

        return None

    def handle_player_disconnected(self, sender: CaravanPlayer):
        self.close_game()

    def recieve_command_from_player(
        self, sender: CaravanPlayer, command: ClientCommand
    ):
        print("recieve_command_from_player")
        player_side = self.get_player_side_by_player(sender)
        if not player_side:
            raise Exception("Player not connected")

        self.game_engine.make_turn(player_side, command.construct_caravan_command())
        self.update_game_state()

    def update_game_state(self):
        # if self.game_engine.game_state == GameState.PLAYER_1_WON:
        #     self.make_game_over(self.players[PlayerSides.PLAYER_1])

        # elif self.game_engine.game_state == GameState.PLAYER_2_WON:
        #     self.make_game_over(self.players[PlayerSides.PLAYER_2])

        # else:

        for player_side, player in self.players.items():
            player.notify_state_updated(self.game_engine.get_game_state_data(player_side))

        if self.game_engine.game_state != CaravanState.PLAYING:
            self.close_game()

    def make_game_over(self, winner: CaravanPlayer):
        # loser = self.get_other_player(winner)

        # Award winner, and blame loser
        # winner.send_win()
        # loser.send_lose()

        self.close_game()

    def close_game(self):
        print("Try closing")
        self.players = {}
        self.on_game_closed.send()
        print("game closed")

        if self.is_active:
            self.is_active = False
