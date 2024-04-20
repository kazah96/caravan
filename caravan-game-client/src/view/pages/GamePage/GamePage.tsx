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
import { PipBoyWindow } from '@components/ui/PipBoyWindow';
import * as R from 'remeda';

const GamePage = observer(function GamePage() {
  const { gameStore, userStore } = useRootStore();
  const navigate = useNavigate();

  useEffect(() => {
    userStore.requestUsersStats();
  }, [userStore]);

  const userStat = R.pipe(
    userStore.userStats,
    R.filter(stat => !!stat.win || !!stat.lose),
    R.map(stat => ({ ...stat, win: stat.win ?? 0, lose: stat.lose ?? 0 })),
    R.sort((a, b) => b.win - a.win),
    R.take(10),
  );

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
            {userStat.map(stat => {
              return (
                <tr key={stat.name + stat.lose + stat.win}>
                  <td>{stat.name}</td>
                  <td>{stat.win ?? 0}</td>
                  <td>{stat.lose ?? 0}</td>
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
