import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRootStore } from '@hooks/useRootStore';

export const ProtectedRoute = observer(function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const {
    authStore: { isLoggedIn },
  } = useRootStore();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  });

  return isLoggedIn ? children : null;
});
