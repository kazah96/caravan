/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@hooks/useRootStore';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { FalloutWindow } from '@components/ui/FalloutWindow';

const GamePage = observer(function GamePage() {
  const { gameStore } = useRootStore();
  const navigate = useNavigate();

  return (
    <main className={cn('w-full h-screen flex justify-center items-center p-6 fallout-font', {})}>
      <FalloutWindow>
        <div className="flex flex-col items-center mt-6">
          <h1 className="text-4xl text-fallout-500 px-4 mb-2">Караван</h1>
          <button
            className="hover:underline cursor-pointer text-2xl bg-fallout-500 px-4 b-shadow"
            onClick={() => {
              handleCreateRoom();
            }}
          >
            Создать комнату
          </button>
        </div>
      </FalloutWindow>
    </main>
  );

  async function handleCreateRoom() {
    const roomID = await gameStore.createGame();
    navigate(`/caravan/${roomID}`);
  }
});

export { GamePage };
