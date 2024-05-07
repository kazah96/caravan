/* eslint-disable react/no-array-index-key */
/* eslint-disable react/button-has-type */
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useRootStore } from '@hooks/useRootStore';
import { Modal } from '@components/ui/utils/modal';
import { CommandLog, MAP_SUIT_TO_VIEW, MAP_VARIANT_TO_VIEW } from '@model/base';

type Props = {
  showModal: boolean;
  onHide: () => void;
};

const LogsModal = observer(function LogsModal(props: Props) {
  const { caravanStore } = useRootStore();
  const { showModal, onHide } = props;
  const { t } = useTranslation();

  return (
    <Modal show={showModal} onHide={() => onHide()}>
      <div className="max-h-[90vh] flex p-4 flex-col-reverse items-start justify-center h-full text-fallout-500 text-left overflow-y-auto">
        {caravanStore.logs.map((log, idx) => (
          <div key={idx} className="last:bg-red-800">
            {idx}: {translateLogs(log)}
          </div>
        ))}
      </div>
    </Modal>
  );

  function translateLogs(log: CommandLog) {
    const playerName = caravanStore.getNameForPlayerSide(log.player_side);

    if (log.command_name === 'put_card') {
      return t('commands.put_card', {
        player_name: playerName,
        caravan_name: log.caravan_name,
        card: MAP_SUIT_TO_VIEW[log.card.suit] + MAP_VARIANT_TO_VIEW[log.card.rank],
      });
    }
    if (log.command_name === 'drop_card') {
      return t('commands.drop_card', {
        player_name: playerName,
      });
    }
    if (log.command_name === 'drop_caravan') {
      return t('commands.drop_caravan', {
        player_name: playerName,
        caravan_name: log.caravan_name,
      });
    }
  }
});

export { LogsModal };
