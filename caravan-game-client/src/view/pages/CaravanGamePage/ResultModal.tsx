/* eslint-disable react/button-has-type */
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useRootStore } from '@hooks/useRootStore';
import { Modal } from '@components/ui/utils/modal';
import { useState } from 'react';

type Props = {
  showModal: boolean;
  modalVariant: 'win' | 'lose';
};

const ResultModal = observer(function ResultModal(props: Props) {
  const { caravanStore } = useRootStore();
  const { showModal, modalVariant } = props;
  const { t } = useTranslation();
  const [awaitingForRematch, setAwaitingForRematch] = useState(false);

  const text = modalVariant === 'win' ? t('game.youWin') : t('game.youLost');
  return (
    <Modal show={showModal} onHide={() => {}}>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl text-fallout-500 px-4 mb-2">{text}</h1>
        <button
          onClick={() => {
            caravanStore.requestRematch();
            setAwaitingForRematch(true);
          }}
          disabled={awaitingForRematch}
          className="hover:underline relative cursor-pointer text-2xl bg-fallout-500 px-4 b-shadow disabled:opacity-50"
        >
          Rematch?
          <div className="h-1 w-full bg-red-500 absolute left-0 progress-bar" />
        </button>
      </div>
    </Modal>
  );
});

export { ResultModal };
