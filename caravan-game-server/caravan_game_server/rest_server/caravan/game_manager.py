from typing import Optional
import uuid
from caravan_game_server.rest_server.caravan.game import Game


class GameManager:
    def __init__(self):
        self.games: dict[str, Game] = {}

    def get_game_by_id(self, game_id: str) -> Game | None:
        return self.games.get(game_id)

    def create_game(self, room_name: Optional[str] = "") -> str:
        id = str(uuid.uuid4())
        game = Game(room_name)
        game.on_game_closed.connect(self._handle_game_closed)

        self.games[id] = game

        return id

    def _handle_game_closed(self, game: Game):
        for id, value in self.games.items():
            if value == game:
                del self.games[id]
                return

        raise KeyError("Game not found")

    def join_game(self, game_id: str, user_id: str):
        game = self.games.get(game_id)

        if not game:
            raise KeyError("Game not found")

        player_side = game.join_player(user_id)

        return player_side


manager = GameManager()
