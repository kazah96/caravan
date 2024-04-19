from caravan_game_server.caravan.caravan_api import router as caravan_router
from caravan_game_server.caravan.game_manager_api import (
    router as game_manager_router,
)
from caravan_game_server.users.users_api import (
    router as user_router,
)

from fastapi import FastAPI

app = FastAPI()

app.include_router(caravan_router)
app.include_router(game_manager_router)
app.include_router(user_router)
