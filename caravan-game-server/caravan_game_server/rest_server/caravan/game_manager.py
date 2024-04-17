import datetime
from typing import Optional
import uuid
from caravan_game_server.rest_server.caravan.game import Game, GameState

from caravan_game_server.rest_server.logger import get_logger
from apscheduler.schedulers.background import BackgroundScheduler

logger = get_logger("game_manager")

GAME_MAX_TTL = 10 * 60 # In seconds


class GameManager:
    def __init__(self):
        self.games: dict[str, Game] = {}

        self.scheduler = BackgroundScheduler()
        self.scheduler.add_job(self._prune_empty_games, "cron", minute="*/4")
        self.scheduler.start()

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
            del self.games[game_id]


        logger.info(f"Pruned {len(game_ids_to_prune)} games")

    def create_game(self, room_name: Optional[str] = "") -> str:

        id = str(uuid.uuid4())
        game = Game(room_name)
        game.on_game_closed.connect(self._handle_game_closed)

        self.games[id] = game
        logger.info(f"Game created: {id}")

        return id

    def _handle_game_closed(self, game: Game):
        for id, value in self.games.items():
            if value == game:
                logger.info(f"Game id {id} is closed")
                del self.games[id]
                return

        raise KeyError("Game not found")

    def join_game(self, game_id: str, user_id: str):
        game = self.games.get(game_id)

        if not game:
            raise KeyError("Game not found")

        player_side = game.join_player(user_id)

        logger.info(f"Player {user_id} joined: {game_id}")
        return player_side


manager = GameManager()
