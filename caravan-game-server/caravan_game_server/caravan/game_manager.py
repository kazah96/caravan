import datetime
from re import U
from typing import Optional
import uuid
from caravan_game_server.caravan.game import Game, GameState
from caravan_game_server.caravan.utils import randomword
from caravan_game_server.db.db import Game as GameDBModel, UserGame as UserGameDBModel

from caravan_game_server.logger import get_logger
from apscheduler.schedulers.background import BackgroundScheduler

logger = get_logger("game_manager")

GAME_MAX_TTL = 30 * 60  # In seconds


class GameManager:
    def __init__(self):
        self.games: dict[str, Game] = {}

        self.scheduler = BackgroundScheduler()
        self.scheduler.add_job(self._prune_empty_games, "cron", minute="*/4")
        self.scheduler.start()

    def get_public_games(self):
        return [id for (id, game) in self.games.items() if game.is_private == False and len(game.joined_players) < 2]

    def get_game_by_id(self, game_id: str) -> Game | None:
        return self.games.get(game_id)

    def _prune_empty_games(self):
        current_timestamp = datetime.datetime.now()
        game_ids_to_prune = []

        for id, game in self.games.items():

            conditions = [
                game.state == GameState.CLOSED,
                (current_timestamp - game.created_at).seconds > GAME_MAX_TTL,
            ]

            if True in conditions:
                game_ids_to_prune.append(id)

        for game_id in game_ids_to_prune:
            self._close_game(game_id)

        logger.info(f"Pruned {len(game_ids_to_prune)} games")

    def _close_game(self, game_id: str):
        # gameModel: GameDBModel = GameDBModel.get_by_id(pk=game_id)

        GameDBModel.update(closed_at=datetime.datetime.now()).where(
            GameDBModel.id == game_id
        ).execute()

        del self.games[game_id]

    def creat_unique_id(self):
        while True:
            id = randomword(7)
            if id not in self.games:
                return id

    def create_game(self, room_name: Optional[str] = "", is_private=True) -> str:
        created_at = datetime.datetime.now()
        id = self.creat_unique_id()
        game = Game(game_name=room_name, created_at=created_at, is_private=is_private)
        game.on_game_closed.connect(self._handle_game_closed)
        game.on_game_winner.connect(self._handle_game_winner)

        self.games[id] = game

        GameDBModel.create(id=id, created_at=created_at)
        logger.info(f"Game created: {id}")

        return id

    def _update_player_wins(self, game_id: str, winner_id: str, loser_id: str):

        UserGameDBModel.update(result="win").where(
            (UserGameDBModel.user == winner_id) & (UserGameDBModel.game == game_id)
        ).execute()

        UserGameDBModel.update(result="lose").where(
            (UserGameDBModel.user == loser_id) & (UserGameDBModel.game == game_id)
        ).execute()

    def _handle_game_winner(self, game: Game):
        for id, value in self.games.items():
            if value == game:
                winner_id = game.get_winner_user_id()
                loser_id = game.get_loser_user_id()
                if winner_id and loser_id:
                    self._update_player_wins(id, winner_id, loser_id)

                logger.info(f"Game id {id} winner {winner_id}, loser {loser_id}")

                return

    def _handle_game_closed(self, game: Game):
        for id, value in self.games.items():
            if value == game:
                self._close_game(id)
                logger.info(f"Game id {id} is closed")
                return

        raise KeyError("Game not found")

    def join_game(self, game_id: str, user_id: str):
        game = self.games.get(game_id)

        if not game:
            raise KeyError("Game not found")

        if not user_id in game.get_joined_players_ids():
            UserGameDBModel.create(user=user_id, game=game_id)

        player_side = game.join_player(user_id)

        logger.info(f"Player {user_id} joined: {game_id}")
        return player_side


manager = GameManager()
