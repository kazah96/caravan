import { observer } from 'mobx-react-lite';
import { Navigate, Route, Routes } from 'react-router-dom';

import { NotificationsContainer } from '@components/Notifications/NotificationsContainer';

import { CaravanGamePage } from '../CaravanGamePage/CaravanGamePage';
import { GamePage } from '../GamePage/GamePage';
import { PageLayout } from './PageLayout';

const Main = observer(function Main() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/game" />} />
        <Route path="/game" element={<GamePage />} />
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        <Route path="/caravan/:id" element={<CaravanGamePage />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
      <NotificationsContainer />
    </PageLayout>
  );
});

export { Main };
