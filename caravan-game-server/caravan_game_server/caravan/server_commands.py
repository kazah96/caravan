from caravan_game_server.caravan.game_engine.model import GameStateData
from caravan_game_server.caravan.model import PlayerSides
from pydantic import BaseModel


class UpdateGameStateCommand(BaseModel):
    name: str = "update_game_state"
    payload: GameStateData


class AcknowledgePlayerCommand(BaseModel):
    name: str = "acknowledge_player"
    player_side: PlayerSides
