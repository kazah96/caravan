/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@hooks/useRootStore';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';

const GamePage = observer(function GamePage() {
  const { gameStore } = useRootStore();
  const navigate = useNavigate();

  return (
    <main className={cn('w-full h-screen flex justify-center items-center p-6 ', {})}>
      <div className="border-2 border-gray-200 rounded-md p-4 flex flex-col items-center justify-center">
        <h1 className="text-2xl">Caravan game</h1>
        <button className="text-blue-500 hover:underline cursor-pointer" onClick={handleCreateRoom}>
          Create room
        </button>
      </div>
    </main>
  );

  async function handleCreateRoom() {
    const roomID = await gameStore.createGame();
    navigate(`/caravan/${roomID}`);
  }
});

export { GamePage };
