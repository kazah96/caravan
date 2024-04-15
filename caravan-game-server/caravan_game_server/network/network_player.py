import asyncio
from blinker import Signal, signal
from caravan_game_server.model.user import User
from caravan_game_server.model.network import NetworkPayload
from caravan_game_server.network.socket import sio
from pydantic import BaseModel


class NetworkPlayer:

    def __init__(self, sid: str, user: User) -> None:
        self.sid = sid
        self.user: User = user
        self.is_connected: bool = True

        self.on_disconnected = Signal()

        self.on_recieved_message = Signal()
        """sender: NetworkPlayer, data: NetworkPayload"""

    def set_is_connected(self, is_connected: bool) -> None:
        self.is_connected = is_connected

    def send_message(self, message: BaseModel):
        loop = asyncio.get_event_loop()
        loop.create_task(sio.send(message.model_dump_json(), self.sid))

    def on_disconnect(self):
        self.set_is_connected(False)
        self.on_disconnected.send(self)

    def on_message(self, data: NetworkPayload):
        print("On message")
        self.on_recieved_message.send(data)
        print("Recievers:", len(self.on_recieved_message.receivers))
