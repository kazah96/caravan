from caravan_game_server.rest_server.caravan.caravan_api import router as caravan_router
from caravan_game_server.rest_server.caravan.game_manager_api import (
    router as game_manager_router,
)
from fastapi import FastAPI
from apscheduler.schedulers.background import BackgroundScheduler


app = FastAPI()

app.include_router(caravan_router)
app.include_router(game_manager_router)
