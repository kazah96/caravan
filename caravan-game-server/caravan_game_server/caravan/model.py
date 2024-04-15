from enum import Enum


class PlayerSides(str, Enum):
    PLAYER_1 = "player1"
    PLAYER_2 = "player2"


class PlayerState(Enum):
    WAITING_FOR_GAME = "WAITING_FOR_GAME"
    IN_GAME = "IN_GAME"
    IN_LOBBY = "IN_LOBBY"
