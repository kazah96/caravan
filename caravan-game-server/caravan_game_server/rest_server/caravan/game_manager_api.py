import asyncio
from functools import wraps
from typing import Annotated, Optional
from caravan_game_server.rest_server.caravan.dependencies import UserIDDependency
from caravan_game_server.rest_server.caravan.game import Game
from caravan_game_server.rest_server.caravan.model import (
    CaravanDiscardCaravanRequest,
    CaravanDiscardCardRequest,
    CaravanPutCardRequest,
    CreateRoomRequest,
)
from fastapi import APIRouter, Depends, HTTPException, Header
from caravan_game_server.rest_server.caravan.game_manager import manager as game_manager

router = APIRouter(prefix="/games")


@router.post("/create")
def create_room(data: Optional[CreateRoomRequest] = None):
    game_id = game_manager.create_game(data.room_name if data else "Defaulе")

    return {"game_id": game_id}


@router.get("/join/{game_id}")
def join_room(game_id: str, user_id: UserIDDependency):
    try:
        player_side = game_manager.join_game(game_id, user_id)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))

    return {"player_side": player_side}
