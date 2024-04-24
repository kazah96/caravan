from typing import Optional
from caravan_game_server.caravan.game_engine.model import Card
from pydantic import BaseModel


class CaravanPutCardRequest(BaseModel):
    card: Card
    caravan_name: str
    card_in_caravan: Optional[int] = None


class CaravanDiscardCardRequest(BaseModel):
    card: Card


class CaravanDiscardCaravanRequest(BaseModel):
    caravan_name: str


class CreateRoomRequest(BaseModel):
    room_name: Optional[str] = ""
