from typing import Annotated
from caravan_game_server.caravan.game import Game
from caravan_game_server.caravan.game_manager import manager as game_manager
from caravan_game_server.users.dependencies import UserDependency
from fastapi import Depends, HTTPException, Header



def game_dependency(
    game_id: str, user: UserDependency
):
    game = game_manager.get_game_by_id(game_id)

    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    players = game.get_joined_players_ids()

    if not str(user.id) in players:
        raise HTTPException(status_code=403, detail="User id not joined to game")

    return game


GameDependency = Annotated[Game, Depends(game_dependency)]
