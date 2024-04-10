from __future__ import annotations
from typing import Dict
from uuid import uuid4
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import os
from blinker import signal
from fastapi.websockets import WebSocketState

stage = os.environ.get("STAGE", "dev")


class ConnectionManager:
    on_user_connected = signal("on-user-connected")
    on_user_disconnected = signal("on-user-disconnected")
    on_user_sent_message = signal("on-user-sent-message")

    def __init__(self):
        self.connections: Dict[str, WebSocket] = {}

    async def connect(
        self,
        websocket: WebSocket,
        client_id: str,
    ):
        await websocket.accept()
        self.connections[client_id] = websocket

    def is_connection_closed(self, connection: WebSocket):
        return connection.client_state == WebSocketState.DISCONNECTED

    async def send_broadcast(self, message: str):

        
        for connection in self.connections.values():
            if self.is_connection_closed(connection):
                continue

            await connection.send_text(message)

    async def send_by_client_id(self, client_id: str, message: str):
          
        if client_id in self.connections:
            connection = self.connections[client_id]
            if self.is_connection_closed(connection):
                return 
            await connection.send_text(message)
        else:
            print(f"Client {client_id} is not connected")

    async def close_connection(self, client_id):
        if client_id in self.connections:
            connection = self.connections[client_id]
            if not self.is_connection_closed(connection):
                await self.connections[client_id].close()

            del self.connections[client_id]

            self.on_user_disconnected.send(client_id)

    async def handle_connection(self, websocket: WebSocket, client_id: str):
        # If client_id is already in the connections, drop the connection
        # if client_id in self.connections:
        #     await self.close_connection(client_id)

        await self.connect(websocket, client_id)
        self.on_user_connected.send(client_id)

        while True:
            try:
                text = await websocket.receive_text()

                if text == "":
                    await self.close_connection(client_id)
                    return

                await self.on_user_sent_message.send_async(client_id, data=text)

            except WebSocketDisconnect:
                await self.close_connection(client_id)
                return

    async def handle_connection_anonymous(self, websocket: WebSocket):
        id = str(uuid4())

        await self.handle_connection(websocket, id)

        # TODO: send a notification of generated UUID
