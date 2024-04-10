import { observer } from 'mobx-react-lite';
import { Navigate, Route, Routes } from 'react-router-dom';

import { NotificationsContainer } from '@components/Notifications/NotificationsContainer';

import { GamePage } from '../GamePage/GamePage';
import { PageLayout } from './PageLayout';
import { LobbyPage } from '../LobbyPage/LobbyPage';
import { useRootStore } from '@hooks/useRootStore';

const Main = observer(function Main() {
  const { socketStore } = useRootStore();
  socketStore.init();

  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/lobby" />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
      <NotificationsContainer />
    </PageLayout>
  );
});

export { Main };
