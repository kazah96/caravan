from caravan_game_server.network.fastapi import fastapiApp
from caravan_game_server.user_manager import UserManager
import caravan_game_server.network.connections
# wrap with a WSGI application


manager = UserManager()
app = fastapiApp


