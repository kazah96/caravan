import { observer } from 'mobx-react-lite';
import { parse } from 'date-fns/parse';
import { useRootStore } from '@hooks/useRootStore';
import { Activity } from '@model/activity';

import { getDurationFromSeconds } from '../../Analytics/utils';
import { DescriptionItem } from './DescriptionItem';
import { PriorityBadge } from './PriorityBadge';
import { ICON_MAP } from '../Filter/iconMap';

function formatDate(date: string) {
  try {
    return parse(date, 'yyyy-MM-dd HH:mm:ss', new Date())
      .toISOString()
      .slice(0, 16)
      .replace('T', ' ')
      .replace(/-/g, '.');
  } catch (e) {
    return date;
  }
}

function roundTo1DecimalPlace(num: number) {
  return Math.round(num * 10) / 10;
}

function splitThousands(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export const TextDescription = observer(function TextDescription(props: { event: Activity }) {
  const { event } = props;
  const {
    anticheaterStore: { teams },
    helperDataStore: { sportOptions },
  } = useRootStore();

  const sportID = event.track.sport_id;
  const sportName = sportOptions.find(sport => sport.id === sportID)?.name;
  const pause = getDurationFromSeconds(event.track.elapsed_time - event.track.moving_time);
  const movingTime = getDurationFromSeconds(event.track.moving_time);
  const distance = splitThousands(roundTo1DecimalPlace(event.track.distance));
  const stoodDistance = splitThousands(roundTo1DecimalPlace(event.standing.distance));
  const elevationGain = splitThousands(roundTo1DecimalPlace(event.track.total_elevation_gain));
  const trackerIcon = event.track.tracker.tracker && ICON_MAP.trackers[event.track.tracker.tracker];
  const osIcon = event.track.os && ICON_MAP.os[event.track.os];
  return (
    <div className="w-full mt-4">
      <ul className="flex flex-col flex-wrap md:max-h-[170px]">
        <DescriptionItem label="Приоритет">
          <PriorityBadge priority={event.extra.priority} />
        </DescriptionItem>
        <DescriptionItem label="Баллы">{event.standing.score}</DescriptionItem>
        <DescriptionItem label="Дистанция">{distance}м</DescriptionItem>
        <DescriptionItem label="Зачетная дистанция">{stoodDistance}м</DescriptionItem>
        <DescriptionItem label="Время">{movingTime}</DescriptionItem>
        <DescriptionItem label="Пауза">{pause}</DescriptionItem>
        <DescriptionItem label="Темп">{event.track.pace}</DescriptionItem>
        <DescriptionItem label="Дата начала">{formatDate(event.track.start_date)}</DescriptionItem>
        <DescriptionItem label="Максимальный темп">{event.track.max_pace ?? '-'}</DescriptionItem>
        <DescriptionItem label="Средний темп за турнир">
          {event.extra.avg_pace_event}
        </DescriptionItem>
        <DescriptionItem label="Средний пульс">
          {event.track.average_heartrate === 0 ? '-' : String(event.track.average_heartrate)}
        </DescriptionItem>
        <DescriptionItem label="Набор высоты">{elevationGain}м</DescriptionItem>
        <DescriptionItem label="Спорт">{sportName ?? ''} </DescriptionItem>
        <DescriptionItem label="Трекер">
          <img src={trackerIcon} alt={event.track.tracker.tracker} className="inline-block" />
        </DescriptionItem>
        <DescriptionItem label="OS">
          {osIcon ? <img src={osIcon} alt={event.track.os} className="inline-block" /> : '-'}
        </DescriptionItem>
        <DescriptionItem label="Команда">
          {event.member.team_id ? getTeamNameById(event.member.team_id)?.value ?? '-' : '-'}
        </DescriptionItem>
        <DescriptionItem label="Кол-во-участий в турнире">
          {String(event.extra.event_memberships)}
        </DescriptionItem>
      </ul>
    </div>
  );

  function getTeamNameById(teamId: number) {
    return Object.values(teams)
      .flat()
      .find(team => {
        return String(team.key) === String(teamId);
      });
  }
});
