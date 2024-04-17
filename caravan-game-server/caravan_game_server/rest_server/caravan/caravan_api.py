from caravan_game_server.rest_server.caravan.dependencies import (
    GameDependency,
    UserIDDependency,
)
from caravan_game_server.rest_server.caravan.game import Game
from caravan_game_server.rest_server.caravan.model import (
    CaravanDiscardCaravanRequest,
    CaravanDiscardCardRequest,
    CaravanPutCardRequest,
)
from fastapi import APIRouter
from caravan_game_server.rest_server.caravan.game_manager import manager as game_manager

router = APIRouter(prefix="/caravan")


@router.post("/{game_id}/put_card", tags=["caravan"])
def caravan_put_card(
    data: CaravanPutCardRequest,
    user_id: UserIDDependency,
    game: GameDependency,
):
    game.put_card(user_id, data)


@router.post("/{game_id}/discard_card", tags=["caravan"])
def caravan_discard_card(
    data: CaravanDiscardCardRequest,
    user_id: UserIDDependency,
    game: GameDependency,
):
    game.discard_card(user_id, data)


@router.post("/{game_id}/discard_caravan", tags=["caravan"])
def caravan_discard_caravan(
    data: CaravanDiscardCaravanRequest,
    user_id: UserIDDependency,
    game: GameDependency,
):
    game.discard_caravan(user_id, data)


@router.get("/{game_id}/subscribe_for_updates", tags=["caravan"])
async def caravan_subscribe_for_updates(game: GameDependency):
    return await game.subscribe_to_updates()


@router.get("/{game_id}/get_state", tags=["caravan"])
async def get_state(game: GameDependency):
    return game.get_game_state()
