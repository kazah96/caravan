from __future__ import annotations
import json
from typing import Dict
from uuid import uuid4
from caravan_game_server import network_manager
from caravan_game_server.connection_manager import ConnectionManager
from caravan_game_server.game import Game
from caravan_game_server.caravan.game_engine import GameEngine
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import os
from blinker import signal
from fastapi.websockets import WebSocketState
from websockets import ConnectionClosed

stage = os.environ.get("STAGE", "dev")

manager = ConnectionManager()
network_manager_instance = network_manager.NetworkManager(manager)
app = FastAPI()

game = Game(network_manager_instance)

@app.websocket("/ws")
async def websocket_endpoint_anonymous(websocket: WebSocket):
    await manager.handle_connection_anonymous(websocket)


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.handle_connection(websocket, client_id)
