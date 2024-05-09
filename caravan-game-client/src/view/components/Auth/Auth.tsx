/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@hooks/useRootStore';
import { useEffect, useState } from 'react';
import { PipBoyWindow } from '@components/ui/PipBoyWindow';
import { useTranslation } from 'react-i18next';

const Auth = observer(function Auth() {
  const { userStore } = useRootStore();
  const { t } = useTranslation();

  useEffect(() => {
    userStore.requestUsersStats();
  }, [userStore]);

  const [variant, setVariant] = useState<'Login' | 'Register'>('Login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [variant]);

  const buttons =
    variant === 'Login'
      ? [
          {
            label: 'Or register',
            callback: () => {
              setVariant('Register');
            },
          },
        ]
      : [
          {
            label: 'Or login',
            callback: () => {
              setVariant('Login');
            },
          },
        ];

  const isValid = name !== '' && password !== '' && error === '';

  return (
    <div className="w-screen h-screen bg-gray-700 flex justify-center items-center fallout-font">
      <div className="min-w-[50vw]">
        <PipBoyWindow title={variant} buttons={buttons}>
          <div className="flex flex-col justify-center px-4">
            <label className="text-4xl text-fallout-500 mb-4">{t('lobby.name')}</label>
            <input
              value={name}
              onChange={e => {
                setName(e.target.value);
                setError('');
              }}
              className="text-white mb-4 px-2 block border border-fallout-500 bg-transparent text-xl"
            />
            <label className="text-4xl text-fallout-500 mb-4">{t('lobby.password')}</label>
            <input
              value={password}
              type="password"
              onChange={e => {
                setPassword(e.target.value);
                setError('');
              }}
              className="text-white mb-4 px-2 block border border-fallout-500 bg-transparent text-xl"
            />
            <button
              type="button"
              disabled={!isValid || userStore.isLoading}
              className="hover:underline cursor-pointer text-2xl bg-fallout-500 px-4 b-shadow disabled:opacity-40 disabled:pointer-events-none"
              onClick={() => {
                handleContinue();
              }}
            >
              {variant}
            </button>
            {error && <div className="text-red-500">{error}</div>}
          </div>
        </PipBoyWindow>
      </div>
    </div>
  );

  function handleContinue() {
    if (variant === 'Register') {
      registerUser();
    } else {
      loginUser();
    }
  }

  async function registerUser() {
    const result = await userStore.createUser(name, password);
    if (result.error) {
      setError(result.error);
    } else {
      await loginUser();
    }
  }

  async function loginUser() {
    const result = await userStore.loginUser(name, password);

    if ('error' in result) {
      setError(result.error as string);
    }
  }
});

export { Auth };
