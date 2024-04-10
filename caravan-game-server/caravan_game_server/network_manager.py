from __future__ import annotations
from ast import Call
import asyncio
from datetime import datetime
from enum import Enum
from functools import wraps
from http import client
from blinker import signal
from typing import Any, Awaitable, Callable, Generic, Literal, Optional, TypeVar, Union
from uuid import uuid4
from caravan_game_server.connection_manager import ConnectionManager
from fastapi.types import DecoratedCallable
from h11 import Data
from pydantic import UUID4, BaseModel


class WebsocketMessageType(Enum):
    EVENT = "EVENT"
    REQUEST = "REQUEST"
    RESPONSE = "RESPONSE"
    ERROR = "ERROR"


class WebsocketMessage(BaseModel):
    type: WebsocketMessageType
    id: UUID4
    path_name: Optional[str] = None
    date: Optional[datetime] = None
    data: Any


request_handlers: dict[str, Callable] = {}


class WebsocketMessageData:
    def __init__(self, client_id: str, name: str, data=None):
        self.client_id = client_id
        self.data = data
        self.name = name


class NetworkManager:
    on_user_sent_event = signal("user-sent-event")

    def __init__(self, connection_manager: "ConnectionManager"):
        self.connection_manager = connection_manager
        self.connection_manager.on_user_sent_message.connect(self.handle_message)
        self.__awaiting_requests: dict[UUID4, asyncio.Event] = {}
        self.__request_responses: dict[UUID4, Any] = {}

        self.__event_subscribers: dict[str, list[Callable]] = {}

    async def handle_message(self, client_id: str, data: str):
        try:
            message = WebsocketMessage.model_validate_json(data)
        except Exception as e:
            print(e)
            await self.send_error_message(client_id, str(e))
            return

        match message.type:
            case WebsocketMessageType.RESPONSE:
                self.__request_responses[message.id] = message.data
                self.__awaiting_requests[message.id].set()

            case WebsocketMessageType.EVENT:
                self.on_user_sent_event.send(client_id, data=message.data)

                if message.path_name:
                    callbacks = self.__event_subscribers[message.path_name]
                    for callback in callbacks:
                        callback(
                            WebsocketMessageData(
                                client_id, data=message.data, name=message.path_name
                            )
                        )
                pass

            case WebsocketMessageType.REQUEST:
                if message.path_name and message.path_name in request_handlers:
                    result = request_handlers[message.path_name](
                        WebsocketMessageData(
                            client_id, data=message.data, name=message.path_name
                        )
                    )
                    await self.send_response_message(client_id, message.id, result)
                else:
                    raise Exception("Request handler is not found")

            case _:
                await self.send_error_message(client_id, "Malformed request")

    @staticmethod
    def __register_request_handler(name: str, func: Callable):
        if name in request_handlers:
            raise ValueError(f"Request handler for {name} already exists")

        request_handlers[name] = func

    @staticmethod
    def request(name: str, func: Callable):
        NetworkManager.__register_request_handler(
            name=name,
            func=func,
        )

    def subscribe_to_event(self, event_name: str, callback: Callable):
        if not event_name in self.__event_subscribers:
            self.__event_subscribers[event_name] = []

        self.__event_subscribers[event_name].append(callback)

    async def send_error_message(self, client_id: str, error_message: Any):
        message = WebsocketMessage(
            type=WebsocketMessageType.ERROR,
            id=uuid4(),
            data=error_message,
            date=datetime.now(),
        )

        stringified = message.model_dump_json()
        await self.connection_manager.send_by_client_id(client_id, stringified)

    async def send_broadcast_event_message(self, path_name: str, data: Any):
        message = WebsocketMessage(
            type=WebsocketMessageType.EVENT,
            id=uuid4(),
            path_name=path_name,
            data=data,
            date=datetime.now(),
        )

        stringified = message.model_dump_json()

        await self.connection_manager.send_broadcast(stringified)

    def send_broadcast_event_message_sync(self, path_name: str, data: Any):
        loop = asyncio.get_event_loop()
        loop.create_task(self.send_broadcast_event_message(path_name, data))

    async def send_event_message(self, client_id: str, path_name: str, data: Any):
        message = WebsocketMessage(
            type=WebsocketMessageType.EVENT,
            id=uuid4(),
            data=data,
            path_name=path_name,
            date=datetime.now(),
        )

        stringified = message.model_dump_json()
        await self.connection_manager.send_by_client_id(client_id, stringified)

    def send_event_message_sync(self, client_id: str, path_name: str, data: Any):
        loop = asyncio.get_event_loop()
        loop.create_task(self.send_event_message(client_id, path_name, data))

    async def send_response_message(self, client_id: str, message_id: UUID4, data: Any):
        message = WebsocketMessage(
            type=WebsocketMessageType.RESPONSE,
            id=message_id,
            data=data,
            date=datetime.now(),
        )

        stringified = message.model_dump_json()
        await self.connection_manager.send_by_client_id(client_id, stringified)

    async def send_request(self, client_id: str, data: Any):
        id = uuid4()
        message = WebsocketMessage(
            type=WebsocketMessageType.REQUEST, id=id, data=data, date=datetime.now()
        )
        stringified = message.model_dump_json()
        await self.connection_manager.send_by_client_id(client_id, stringified)

        awaiting_response_event = asyncio.Event()
        self.__awaiting_requests[id] = awaiting_response_event

        await asyncio.wait_for(awaiting_response_event.wait(), timeout=30)

        return self.__request_responses[id]
