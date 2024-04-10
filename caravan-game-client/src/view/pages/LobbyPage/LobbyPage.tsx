/* eslint-disable react/button-has-type */
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useRootStore } from '@hooks/useRootStore';
import cn from 'classnames';

const LobbyPage = observer(function GamePage() {
  const { socketStore, gameStore, lobbyStore } = useRootStore();
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    if (socketStore.isConnected) {
      lobbyStore.requestRooms();
      lobbyStore.requestMyPlayer();
      // socketStore.socket?.send('');
    }
  }, [socketStore.isConnected, socketStore.socket]);

  if (lobbyStore.myPlayer?.state === 'WAITING_FOR_GAME') {
    return <div>WAITING</div>;
  }

  return (
    <div className="container p-4 gap-4 mx-auto flex">
      <h1>{lobbyStore.myPlayer?.name}</h1>
      <div className="bg-slate-300 rounded-md p-4 flex-1">
        <h1 className="text-2xl mb-4">Rooms online</h1>
        <div className="bg-slate-50 p-2 rounded-sm text-xl min-h-36 mb-4 flex flex-col items-start">
          {Object.values(lobbyStore.rooms).map(room => (
            <button
              onClick={() => {
                lobbyStore.joinRoom(room.name);
              }}
              disabled={room.player_count === 2}
              className="mb-4 cursor-pointer disabled:bg-red-300 disabled:text-opacity-30 disabled:pointer-events-none"
              key={room.name}
            >
              {room.name} {room.player_count} / 2
            </button>
          ))}
        </div>
        <div className="flex h-8">
          <input
            type="text"
            className="border-2 p-2 border-gray-400 rounded-xl me-2"
            placeholder="Name"
            onChange={v => setRoomName(v.target.value)}
          />
          <button
            disabled={roomName === ''}
            value={roomName}
            onClick={() => {
              setRoomName('');
              lobbyStore.createRoom(roomName);
            }}
            className="border-2 p-2 border-gray-400 rounded-xl flex justify-center items-center"
          >
            Create
          </button>
        </div>
      </div>
      <div className="bg-slate-300 rounded-md p-4 flex-1">
        <div className="p-4 bg-white">
          {lobbyStore.players.map(player => (
            <div className="pb-4" key={player.client_id}>
              <h1>{player.name}</h1>

              {/* <h1>{player.client_id}</h1> */}
              {/* <h1>{player.player_id}</h1> */}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1" />
      <div className="flex-1" />
    </div>
  );
});

export { LobbyPage };
