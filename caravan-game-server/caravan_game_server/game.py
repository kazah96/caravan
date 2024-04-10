from __future__ import annotations
from email.policy import strict
import json
import random
import string
from typing import Dict, List
from enum import Enum
from uuid import uuid1, uuid4
from blinker import signal
from caravan_game_server.game_engine import GameEngine
from caravan_game_server.network_manager import WebsocketMessageData, NetworkManager
from pydantic import BaseModel, computed_field


ROOM_MAX_PLAYERS = 2


def generate_rand_string(symbols: int):
    return "".join(random.choices(string.ascii_letters + string.digits, k=symbols))


class PlayerState(Enum):
    WAITING_FOR_GAME = "WAITING_FOR_GAME"
    IN_GAME = "IN_GAME"
    IN_LOBBY = "IN_LOBBY"


class Player(BaseModel):
    player_id: str
    name: str
    client_id: str
    state: PlayerState = PlayerState.IN_LOBBY


class Room(BaseModel):
    players: List[str] = []
    name: str

    @computed_field
    @property
    def player_count(self) -> int:
        return len(self.players)


class AllInfo(BaseModel):
    rooms: dict[str, Room] = {}


class RoomRequestData(BaseModel):
    room_name: str


RAND_NAMES = ["VOLODYA", "IVAN", "SERGAY"]


class GameInstance:
    def __init__(self, player1_id: str, player2_id: str) -> None:
        self.player1_id = player1_id
        self.player2_id = player2_id

        self.game = GameEngine()


class Players:
    on_player_added = signal("on_player_added")
    on_player_removed = signal("on_player_removed")
    on_player_updated = signal("on_player_updated")

    def __init__(self) -> None:
        self.players_online: Dict[str, Player] = {}

        NetworkManager.request("players/whoami", self.__handle_whoami)

    def __handle_whoami(self, message: WebsocketMessageData):
        message.client_id
        return self.players_online[message.client_id]

    def handle_add_player(self, client_id: str):
        player_id = generate_rand_string(15)
        new_player = Player(
            client_id=client_id, player_id=player_id, name=random.choice(RAND_NAMES)
        )

        self.players_online[client_id] = new_player

        self.on_player_added.send(player_id)

    def remove_player(self, client_id: str):
        player = self.players_online[client_id]
        del self.players_online[client_id]

        self.on_player_removed.send(player.player_id)

    def get_player_from_client_id(self, client_id: str):
        return self.players_online[client_id]

    def get_player_by_player_id(self, player_id: str):
        return [x for x in self.players_online.values() if x.player_id == player_id][0]

    def update_player_state(self, player_id: str, state: PlayerState):
        self.get_player_by_player_id(player_id).state = state
        self.on_player_updated.send(player_id)


class Rooms:
    on_room_added = signal("on_room_added")
    on_player_connected_to_room = signal("on_player_connected_to_room")

    def __init__(self, game_instance: Game) -> None:
        self.game_instance = game_instance
        self.rooms: dict[str, Room] = {}

        NetworkManager.request("rooms/get_all_rooms", self.__handle_get_rooms)
        NetworkManager.request("rooms/create_new_room", self.__handle_create_new_room)
        NetworkManager.request(
            "rooms/connect_to_room", self.__handle_add_player_to_room
        )

    def __handle_get_rooms(self, message: WebsocketMessageData):
        return self.get_rooms()

    def __handle_create_new_room(self, message: WebsocketMessageData):
        parsed_data = RoomRequestData.model_validate(message.data)

        return self.add_new_room(parsed_data.room_name)

    def __handle_add_player_to_room(self, message: WebsocketMessageData):
        client_id = message.client_id
        parsed_data = RoomRequestData.model_validate(message.data)

        try:
            self.add_player_to_room(
                parsed_data.room_name,
                self.game_instance.players.get_player_from_client_id(
                    client_id
                ).player_id,
            )
        except Exception as e:
            return {"error": str(e)}

        return {"info": "success"}

    def get_rooms(self):
        return self.rooms

    def add_new_room(self, room_name: str):
        room = Room(name=room_name)
        self.rooms[room_name] = room
        self.on_room_added.send(room)
        return self.rooms

    def add_player_to_room(self, room_name: str, player_id: str) -> None:
        if not room_name in self.rooms:
            raise Exception("No such room: %s" % room_name)
        room = self.rooms[room_name]

        if len(room.players) >= ROOM_MAX_PLAYERS:
            raise Exception("Room is full: %s" % room_name)
        if player_id in room.players:
            raise Exception("Player already in room: %s" % player_id)

        self.rooms[room_name].players.append(player_id)

        self.on_player_connected_to_room.send(player_id, room=room)

    def remove_player_from_room(self, player_id: str) -> None:
        current_room_of_player = self.get_room_of_player(player_id)

        if not current_room_of_player:
            return
            # raise Exception("No such room: %s" % current_room_of_player)

        self.rooms[current_room_of_player.name].players.remove(player_id)

    def get_room_of_player(self, player_id: str):
        for room_name, room in self.rooms.items():
            if player_id in room.players:
                return room
        return None


class Game:
    def __init__(self, network_manager: NetworkManager) -> None:
        self.network_manager = network_manager
        self.players = Players()
        self.rooms = Rooms(self)
        self.game_instances: dict[str, GameInstance] = {}

        self.wiring()

    def wiring(self):

        # ON CONNECT
        self.network_manager.connection_manager.on_user_connected.connect(
            self.players.handle_add_player
        )

        self.network_manager.connection_manager.on_user_connected.connect(
            self.handle_update_rooms
        )

        # ON Disconnect
        self.network_manager.connection_manager.on_user_disconnected.connect(
            self.players.remove_player
        )

        self.players.on_player_added.connect(self.handle_update_players)

        self.players.on_player_updated.connect(self.handle_update_players)

        self.players.on_player_removed.connect(self.handle_player_removed)

        self.rooms.on_room_added.connect(self.handle_update_rooms)
        self.rooms.on_player_connected_to_room.connect(self.handle_player_added_to_room)
        self.rooms.on_player_connected_to_room.connect(self.handle_update_rooms)

    def send_whoami(self, player_id: str):
        client_id = self.players.get_player_by_player_id(player_id).client_id

        self.network_manager.send_event_message_sync(
            client_id,
            "players/whoami",
            self.players.get_player_from_client_id(client_id),
        )

    def handle_update_players(self, player_id: str):
        self.send_whoami(player_id)
        self.network_manager.send_broadcast_event_message_sync(
            "players/update_players", list(self.players.players_online.values())
        )

    def handle_update_rooms(self, *args, **kwargs):
        print("Update Rooms")
        self.network_manager.send_broadcast_event_message_sync(
            "rooms/update_rooms", self.rooms.rooms
        )

    def handle_player_added_to_room(self, player_id: str, room: Room):
        print(f"Player {player_id} added to room")

        self.players.update_player_state(player_id, PlayerState.WAITING_FOR_GAME)

        if room.player_count == 2:
            print("Room is full")

    def handle_player_removed(self, player_id: str):
        print("handle player_removed")
        self.network_manager.send_broadcast_event_message_sync(
            "players/update_players", list(self.players.players_online.values())
        )
        self.rooms.remove_player_from_room(player_id)
        self.handle_update_rooms()
