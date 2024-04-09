from typing import Dict, List
from fastapi import FastAPI, WebSocket
import os

from caravan_game_server.game import Game, PlayerManager

stage = os.environ.get("STAGE", "dev")

player_manager = PlayerManager()


class ConnectionManager:
    def __init__(self):
        self.connections: Dict[str, WebSocket] = {}

    async def connect(self, client: str, websocket: WebSocket):
        await websocket.accept()
        self.connections[client] = websocket

    async def broadcast(self, data: str):
        for connection in self.connections:
            await connection.send_text(data)


manager = ConnectionManager()
app = FastAPI()


@app.get("/")
def index():
    return {"Hello": "World"}


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(client=client_id, websocket=websocket)

    while True:
        data = await websocket.receive_text()
        player_manager.handle_message(data)
        # await websocket.send_text(f"Message {data}")


@app.get("/users/{user_id}")
def read_item(user_id: int):
    return {"user_id": user_id}


game = Game(player_manager)
