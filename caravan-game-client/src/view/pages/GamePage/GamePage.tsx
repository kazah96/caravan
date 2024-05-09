/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@hooks/useRootStore';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PipBoyWindow } from '@components/ui/PipBoyWindow';
import * as R from 'remeda';
import { useTranslation } from 'react-i18next';
import { Modal } from '@components/ui/utils/modal';

const GamePage = observer(function GamePage() {
  const { gameStore, userStore } = useRootStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showAllowNotificationModal, setShowAllowNotificationModal] = useState(false);
  useEffect(() => {
    userStore.requestUsersStats();
  }, [userStore]);

  useEffect(() => {
    if ('Notification' in window && window.Notification.permission === 'default') {
      setShowAllowNotificationModal(true);
    }
  }, []);

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
      <PipBoyWindow
        className="w-full mb-6"
        title={userStore.userName}
        buttons={[
          {
            label: 'Log out',
            callback: () => {
              userStore.handleLogOff();
            },
          },
        ]}
      >
        <div className="flex justify-center items-center gap-4">
          <button
            className="hover:underline cursor-pointer text-2xl bg-fallout-500 px-4 b-shadow"
            onClick={() => {
              handleCreateRoom();
            }}
          >
            {t('lobby.createRoom')}
          </button>
          <button
            className="hover:underline cursor-pointer text-2xl bg-fallout-500 px-4 b-shadow"
            onClick={() => {
              handlePublicRoom();
            }}
          >
            {t('lobby.createPublicRoom')}
          </button>
        </div>
      </PipBoyWindow>
      <PipBoyWindow className="mt-4" title={t('lobby.rating.score')}>
        <table className="w-full text-xl text-fallout-300 text-start  font-[NewLetterGotic]">
          <thead className="border-b border-fallout-500 ">
            <tr className="text-start">
              <th>{t('lobby.rating.name')}</th>
              <th>{t('lobby.rating.wins')}</th>
              <th>{t('lobby.rating.loses')}</th>
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
      <Modal show={showAllowNotificationModal} onHide={() => setShowAllowNotificationModal(false)}>
        <div className="flex flex-col items-center justify-center h-full text-fallout-500 p-4 ">
          <h1 className="text-4xl px-4 mb-2">Enable notifications?</h1>
          <div className="flex justify-center items-center gap-4">
            <button
              className="hover:underline cursor-pointer text-2xl bg-fallout-500 px-4 b-shadow text-black"
              onClick={() => {
                handleRequestNotifications();
              }}
            >
              Yes
            </button>
            <button
              className="hover:underline cursor-pointer text-2xl bg-fallout-500 px-4 b-shadow text-black"
              onClick={() => {
                setShowAllowNotificationModal(false);
              }}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );

  async function handleRequestNotifications() {
    await window.Notification.requestPermission();
    setShowAllowNotificationModal(false);
  }

  async function handleCreateRoom(isPublic = false) {
    const roomID = await gameStore.createGame(isPublic);
    navigate(`/caravan/${roomID}`);
  }

  async function handlePublicRoom() {
    const freeRooms = await gameStore.getOpenRooms();

    if (freeRooms.length > 0) {
      navigate(`/caravan/${freeRooms[0]}`);
    } else {
      handleCreateRoom(true);
    }
  }
});

export { GamePage };
