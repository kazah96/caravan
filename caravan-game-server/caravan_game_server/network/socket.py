import socketio

# create a Socket.IO server
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
)

socketApp = socketio.ASGIApp(sio, socketio_path="/ws/socket.io")
