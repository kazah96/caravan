import pytest
import socketio

# asyncio
client1 = socketio.AsyncClient()
client2 = socketio.AsyncClient()

@pytest.mark.asyncio
async def test_an_async_function():

    await client1.connect('http://localhost:8000')
    await client2.connect('http://localhost:8000')

    assert client1.sid != client2.sid