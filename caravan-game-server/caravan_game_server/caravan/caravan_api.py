from caravan_game_server.caravan.dependencies import (
    GameDependency,
)
from caravan_game_server.users.dependencies import (
    UserDependency,
)
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
    user: UserDependency,
    game: GameDependency,
):
    game.put_card(str(user.id), data)


@router.post("/{game_id}/discard_card", tags=["caravan"])
def caravan_discard_card(
    data: CaravanDiscardCardRequest,
    user: UserDependency,
    game: GameDependency,
):
    game.discard_card(str(user.id), data)


@router.post("/{game_id}/discard_caravan", tags=["caravan"])
def caravan_discard_caravan(
    data: CaravanDiscardCaravanRequest,
    user: UserDependency,
    game: GameDependency,
):
    game.discard_caravan(str(user.id), data)


@router.get("/{game_id}/subscribe_for_updates", tags=["caravan"])
async def caravan_subscribe_for_updates(
    game: GameDependency,
    user: UserDependency,
):
    return await game.subscribe_to_updates(str(user.id))


@router.get("/{game_id}/get_state", tags=["caravan"])
async def get_state(game: GameDependency, user: UserDependency):
    return game.get_game_state(str(user.id))


@router.get("/{game_id}/rematch", tags=["caravan"])
async def player_request_rematch(game: GameDependency, user: UserDependency):
    return game.player_request_rematch(str(user.id))
