from typing import Annotated
from caravan_game_server.rest_server.caravan.game import Game
from caravan_game_server.rest_server.caravan.game_manager import manager as game_manager
from fastapi import Depends, HTTPException, Header


def user_id_dependency(user_id: str = Header(None)):
    if not user_id:
        raise HTTPException(status_code=403, detail="User id not provided")

    return user_id

def game_dependency(
    game_id: str, user_id: Annotated[str, Depends(user_id_dependency)]
):
    game = game_manager.get_game_by_id(game_id)

    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    players = game.get_joined_players_ids()

    if not user_id in players:
        raise HTTPException(status_code=403, detail="User id not joined to game")

    return game


GameDependency = Annotated[Game, Depends(game_dependency)]
UserIDDependency = Annotated[str, Depends(user_id_dependency)]
