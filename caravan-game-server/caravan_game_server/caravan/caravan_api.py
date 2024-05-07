from caravan_game_server.caravan.dependencies import (
    GameDependency,
    UserIDDependency,
)
from caravan_game_server.caravan.game import Game
from caravan_game_server.caravan.model import (
    CaravanDiscardCaravanRequest,
    CaravanDiscardCardRequest,
    CaravanPutCardRequest,
)
from fastapi import APIRouter

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
async def caravan_subscribe_for_updates(game: GameDependency, user_id: UserIDDependency):
    return await game.subscribe_to_updates(user_id)


@router.get("/{game_id}/get_state", tags=["caravan"])
async def get_state(game: GameDependency, user_id: UserIDDependency):
    return game.get_game_state(user_id)

@router.get("/{game_id}/rematch", tags=["caravan"])
async def player_request_rematch(game: GameDependency, user_id: UserIDDependency):
    return game.player_request_rematch(user_id)
