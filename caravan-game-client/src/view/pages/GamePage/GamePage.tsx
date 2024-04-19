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
import { useEffect } from 'react';
import { PipBoyWindow } from '@/view/components/ui/PipBoyWindow';

const GamePage = observer(function GamePage() {
  const { gameStore, userStore } = useRootStore();
  const navigate = useNavigate();

  useEffect(() => {
    userStore.requestUsersStats();
  }, [userStore]);

  return (
    <main
      className={cn(
        'max-w-screen-md mx-auto h-screen flex flex-col justify-center items-center p-6 fallout-font',
        {},
      )}
    >
      <FalloutWindow className="w-full">
        <div className="flex flex-col items-center mt-6">
          <h1 className="text-4xl text-fallout-500 px-4 mb-2">Здарова, {userStore.userName}</h1>
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
      <PipBoyWindow className="mt-4" title="Рейтинг">
        <table className="w-full text-xl text-fallout-300 text-start  font-[NewLetterGotic]">
          <thead className="border-b border-fallout-500 ">
            <tr className="text-start">
              <th>Имя</th>
              <th>Побед</th>
              <th>Поражений</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {userStore.userStats.map(stat => {
              return (
                <tr key={stat.name}>
                  <td>{stat.name}</td>
                  <td>{stat.win}</td>
                  <td>{stat.lose}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </PipBoyWindow>
    </main>
  );

  async function handleCreateRoom() {
    const roomID = await gameStore.createGame();
    navigate(`/caravan/${roomID}`);
  }
});

export { GamePage };
