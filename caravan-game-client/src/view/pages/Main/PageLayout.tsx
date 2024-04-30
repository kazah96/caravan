import { FalloutWindow } from '@components/ui/FalloutWindow';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import CogIcon from '@assets/icons/cogwheel.svg?react';
import { useRootStore } from '@hooks/useRootStore';
import { useTranslation } from 'react-i18next';

type PageLayoutProps = {
  children: React.ReactNode;
};

const PageLayout = observer(function PageLayout(props: PageLayoutProps) {
  const { children } = props;
  const [name, setName] = useState('');
  const { userStore } = useRootStore();
  const { t } = useTranslation();

  useEffect(() => {
    userStore.handleWhoami();
  }, [userStore]);

  const isNameValid = name.length > 3;

  if (userStore.isLoading) {
    return (
      <div className="w-screen h-screen bg-gray-700 flex justify-center items-center fallout-font">
        <div className="center-absolute">
          <CogIcon
            style={{}}
            className={cn('w-16 h-16 lg:w-40 lg:h-40', {
              'animate-spin-slow': true,
            })}
          />
        </div>
      </div>
    );
  }

  if (!userStore.isUser) {
    return (
      <div className="w-screen h-screen bg-gray-700 flex justify-center items-center fallout-font">
        <FalloutWindow>
          <div className="flex flex-col justify-center px-4">
            <h1 className="text-4xl text-fallout-500 mb-4">{t('lobby.whatsYourName')}</h1>

            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="text-white mb-4 px-2 block border border-fallout-500 bg-transparent text-xl"
            />
            <button
              type="button"
              disabled={!isNameValid}
              className="hover:underline cursor-pointer text-2xl bg-fallout-500 px-4 b-shadow disabled:opacity-40 disabled:pointer-events-none"
              onClick={() => {
                userStore.handleCreateUser(name);
              }}
            >
              {t('lobby.continue')}
            </button>
          </div>
        </FalloutWindow>
      </div>
    );
  }

  return children;
});

export { PageLayout };
