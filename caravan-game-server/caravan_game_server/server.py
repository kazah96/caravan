import json
from tkinter import W
from typing import Dict, List
from caravan_game_server.game_engine import GameEngine, Players, PutCardCommand
from caravan_game_server.model import Card, Rank, Suit
from fastapi import FastAPI, WebSocket
import os


stage = os.environ.get("STAGE", "dev")

# player_manager = PlayerManager()

player_map = {
    # "369cc5ad-fe41-4ad7-85f5-f739195ad697": Players.PLAYER_1,
    # "ea5739ca-2fda-4bc5-b244-def44f82c122": Players.PLAYER_2,
}


class ConnectionManager:
    def __init__(self):
        self.connections: Dict[str, WebSocket] = {}

    async def connect(self, client: str, websocket: WebSocket):
        await websocket.accept()
        self.connections[client] = websocket


manager = ConnectionManager()
app = FastAPI()

game = GameEngine()
game.init_game()


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(client=client_id, websocket=websocket)

    if not client_id in player_map:
        if len(player_map) == 0:
            player_map[client_id] = Players.PLAYER_1
        else:            
        
            player_map[client_id] = Players.PLAYER_2


    message = {
        "type": "UPDATE_GAME_DATA",
        "payload": {
            "current_turn": game.player_turn,
            "current_player": player_map[client_id],
            "total_deck_count": len(game.decks[player_map[client_id]]),
            "hand": game.current_hands[player_map[client_id]],
            "caravans": list(game.caravans.values()),
        },
    }
    print("Sended message")
    await websocket.send_text(json.dumps(message))

    while True:
        text = await websocket.receive_text()

        if text == "":
            del manager.connections[client_id]
            del player_map[client_id]
            break
        if text:
            data = json.loads(text)

            if "type" in data and data["type"] == "PUT_CARD_ACTION":
                payload = data["payload"]
                card = payload["card"]

                card_rank = card["rank"]
                card_suit = card["suit"]

                game.make_turn(
                    PutCardCommand(
                        Card(rank=Rank(card_rank), suit=Suit(card_suit)),
                        caravan_name=payload["caravanName"],
                        card_in_caravan=None,
                    )
                )

        for id, connection in manager.connections.items():
            message = {
                "type": "UPDATE_GAME_DATA",
                "payload": {
                    "current_turn": game.player_turn,
                    "current_player": player_map[id],
                    "total_deck_count": len(game.decks[player_map[id]]),
                    "hand": game.current_hands[player_map[id]],
                    "caravans": list(game.caravans.values()),
                },
            }

            await connection.send_text(json.dumps(message))


# game = Game(player_manager)
