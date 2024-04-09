import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { PropsWithChildren } from 'react';

import CloseIcon from '@assets/icons/Close/Close.svg?react';
import { useRootStore } from '@hooks/useRootStore';

type Props = PropsWithChildren;

function ToastContainer(props: Props) {
  const { children } = props;

  return <div className="fixed bottom-0 left-0 z-50 m-14">{children}</div>;
}

const VARIANTS_MAP = {
  danger: 'bg-red-200',
  primary: 'bg-blue-200',
  success: 'bg-green-200',
};

const NotificationsContainer = observer(function NotificationsContainer() {
  const {
    notificationsStore: { notifications, dispose },
  } = useRootStore();

  return (
    <ToastContainer>
      {notifications.map(notification => (
        <article
          key={notification.id}
          className={cn(
            'overflow-hidden rounded-lg w-60 mt-2 shadow-xl',
            VARIANTS_MAP[notification.variant],
          )}
        >
          <header className="px-4 py-2 border-b flex justify-between items-center font-bold text-gray-700">
            <h4 className="me-auto">{notification.title}</h4>
            <button aria-label="Close" type="button" onClick={() => dispose(notification.id)}>
              <CloseIcon className="me-2" />
            </button>
          </header>
          <section className="p-4 bg-white">{notification.content}</section>
        </article>
      ))}
    </ToastContainer>
  );
});

export { NotificationsContainer };
