import React from 'react';
import { RouterProvider, createHashRouter } from 'react-router-dom';

import { RootStoreProvider } from '@hooks/useRootStore';
import { Main } from '@pages/Main/Main';
import '@styles/index.css';

import { LoginForm } from './LoginPage/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';

// TODO: Fix with browser router
const router = createHashRouter([
  {
    path: '*',
    element: (
      // <ProtectedRoute>
      <Main />
      // </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <LoginForm />,
  },
]);

export function App() {
  return (
    <React.StrictMode>
      <RootStoreProvider>
        <RouterProvider router={router} />
      </RootStoreProvider>
    </React.StrictMode>
  );
}
