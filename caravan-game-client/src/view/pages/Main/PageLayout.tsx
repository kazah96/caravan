import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import cn from 'classnames';
import CogIcon from '@assets/icons/cogwheel.svg?react';
import { useRootStore } from '@hooks/useRootStore';
import { Auth } from '@components/Auth/Auth';

type PageLayoutProps = {
  children: React.ReactNode;
};

const PageLayout = observer(function PageLayout(props: PageLayoutProps) {
  const { children } = props;
  const { userStore } = useRootStore();

  useEffect(() => {
    userStore.handleWhoami();
  }, [userStore]);

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
    return <Auth />;
  }

  return children;
});

export { PageLayout };
