import WarningIcon from '@assets/icons/Alert/Triangle.svg?react';
import CheckIcon from '@assets/icons/Checkmark/Circle 2.svg?react';
import EditIcon from '@assets/icons/Edit/Edit 1.svg?react';
import GlobeIcon from '@assets/icons/Globe/Globe 1.svg?react';
import HandIcon from '@assets/icons/Hand.svg?react';
import LayerIcon from '@assets/icons/Layers.svg?react';
import ClockIcon from '@assets/icons/Main/Clock.svg?react';
import DuringIcon from '@assets/icons/Main/During.svg?react';
import SpeedIcon from '@assets/icons/Main/Speed.svg?react';
import * as ui from '@components/ui';
import { Activity } from '@model/activity';
import { getTrackExtraInfo } from '@store/tournaments/utils';

export function ExtraButtons(props: {
  anticheaterEntity: Activity;
  onToggleGPS: (flag: boolean) => void;
  onToggleManual: (flag: boolean) => void;
}) {
  const { anticheaterEntity, onToggleGPS, onToggleManual } = props;
  const { track } = anticheaterEntity;
  const trackExtraInfo = getTrackExtraInfo(anticheaterEntity);

  return (
    <>
      <ui.buttons.smallIcon
        IconComponent={WarningIcon}
        isActive={trackExtraInfo.haveComplains}
        tooltip="Есть жалобы"
      />
      <ui.buttons.smallIcon
        IconComponent={HandIcon}
        onClick={() => onToggleManual(!trackExtraInfo.manualInput)}
        isActive={trackExtraInfo.manualInput}
        tooltip="Ручной ввод"
      />
      <ui.buttons.smallIcon
        IconComponent={SpeedIcon}
        isActive={trackExtraInfo.tooFast}
        tooltip={`Слишком быстро. Макс. темп: ${anticheaterEntity.track.max_pace}, лимит ${anticheaterEntity.extra.too_fast_limit}`}
      />
      <ui.buttons.smallIcon
        IconComponent={GlobeIcon}
        isActive={trackExtraInfo.hasGps}
        onClick={() => onToggleGPS(!trackExtraInfo.hasGps)}
        variant="green"
        tooltip="Есть GPS трек"
      />
      <ui.buttons.smallIcon
        IconComponent={DuringIcon}
        isActive={trackExtraInfo.importDelay}
        tooltip={`Завершена в ${track.start_date}+${track.elapsed_time} UTC, загружена в ${track.created_at} UTC`}
      />
      <ui.buttons.smallIcon
        IconComponent={ClockIcon}
        isActive={trackExtraInfo.stood}
        variant="green"
        tooltip="Зачтено"
      />
      <ui.buttons.smallIcon
        IconComponent={EditIcon}
        isActive={trackExtraInfo.edited}
        tooltip="Редакция модератором"
        onClick={() => {
          window.open(`https://admin.alivebe.com/tracker-data/update/${track.id}`, '_blank');
        }}
      />
      <ui.buttons.smallIcon
        IconComponent={LayerIcon}
        isActive={trackExtraInfo.hasDupes}
        tooltip="Есть дубли"
      />
      <ui.buttons.smallIcon
        IconComponent={CheckIcon}
        isActive={trackExtraInfo.checked}
        variant="green"
        tooltip="Проверено модератором"
      />
    </>
  );
}
