from typing import Optional
from caravan_game_server.caravan.model import (
    CreateRoomRequest,
)
from fastapi import APIRouter, HTTPException
from caravan_game_server.caravan.game_manager import manager as game_manager
from caravan_game_server.users.dependencies import UserDependency

router = APIRouter(prefix="/games")


@router.post("/create")
def create_room(data: Optional[CreateRoomRequest] = None):
    game_id = game_manager.create_game(data.room_name if data else "Defaulе")

    return {"game_id": game_id}


@router.get("/join/{game_id}")
def join_room(game_id: str, user: UserDependency):
    try:
        player_side = game_manager.join_game(game_id, str(user.id))
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))

    return {"player_side": player_side}
