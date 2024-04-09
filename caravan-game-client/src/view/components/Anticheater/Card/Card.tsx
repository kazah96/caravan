import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import CommentsIcon from '@assets/icons/Message/Circle.svg?react';
import TrashIcon from '@assets/icons/Trash/Trash 2.svg?react';
import * as ui from '@components/ui';
import { useRootStore } from '@hooks/useRootStore';
import { Activity } from '@model/activity';

import { Analytics } from '../../Analytics/Analytics';
import { CommentaryModal } from './CommentaryModal';
import { ExtraButtons } from './ExtraButtons';
import { RemoveActivityModal } from './RemoveActivityModal';
import { TextDescription } from './TextDescription';

type Props = {
  event: Activity;
};

function fallbackRender({ error }: { error: { message: string } }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

const Card = observer(function Card(props: Props) {
  const {
    anticheaterStore: {
      tournamentsById,
      toggleManual,
      toggleGPS,
      toggleIsCheater,
      toggleIsChecked,
      toggleIsStanding,
      deleteTrack,
    },
  } = useRootStore();
  const { event } = props;
  const [showGraph, setShowGraph] = useState(false);
  const [openedModal, setOpenedModal] = useState<'removeModal' | 'commentModal' | null>(null);
  const tournamentByEventID = tournamentsById?.[event.event_id];
  const isCheater = event.extra.cheater;
  const isChecked = event.extra.checked;
  const isStanding = !!event.standing.standing.stood;
  const showAnalyticsButton = event.track.tracker.tracker === 'alivebe' && !!event.track.route;

  return (
    <section className="bg-white md:p-4 md:h-[304] rounded-b-lg">
      <div className="lg:flex">
        {!event.track.image && (
          <div className="bg-gray-300 min-h-[300px] min-w-[34%] flex items-center justify-center md:rounded-lg">
            <h1 className="text-secondary">No image</h1>
          </div>
        )}
        {event.track.image && (
          <img
            src={event.track.image}
            loading="lazy"
            className="w-full object-cover max-h-[400px] lg:w-[33%] lg:flex-0 md:rounded-lg"
            alt=""
          />
        )}
        <div className="p-4 w-full md:p-0 md:ps-6 md:mt-4 lg:mt-0">
          <div className="block md:flex justify-between">
            <div className="flex flex-initial items-center">
              <img src={event.track.user.avatar} alt="" className="rounded-full w-10 h-10 me-2" />

              <div className="truncate">
                <h4 className="font-bold truncate">{event.track.user.full_name}</h4>
                {tournamentByEventID && (
                  <h5 className="text-sm truncate">{tournamentByEventID.name}</h5>
                )}
              </div>
            </div>
            <div className="w-full mt-4 md:w-auto md:mt-0">
              <div className="flex gap-2 justify-center">
                <ExtraButtons
                  onToggleGPS={hasGPS => {
                    toggleGPS(event.event_id, event.track.id, hasGPS);
                  }}
                  onToggleManual={manual => {
                    toggleManual(event.event_id, event.track.id, manual);
                  }}
                  anticheaterEntity={event}
                />
              </div>
            </div>
          </div>
          <TextDescription event={event} />
          <div className="w-full mt-4 grid grid-cols-6 gap-2 md:flex">
            <ui.buttons.filled
              onClick={() => {
                toggleIsCheater(event.event_id, event.track.id, !isCheater);
              }}
              className={cn('mt-4 col-span-3', { 'bg-red-200': isCheater })}
            >
              Читер
            </ui.buttons.filled>

            <ui.buttons.filled
              onClick={() => {
                toggleIsChecked(event.event_id, event.track.id, !isChecked);
              }}
              className={cn('mt-4 col-span-3', { 'bg-green-200': isChecked })}
            >
              Проверено
            </ui.buttons.filled>

            <ui.buttons.filled
              onClick={() => {
                setOpenedModal('commentModal');
              }}
              className={cn('mt-4 col-span-2 md:w-fit')}
            >
              <span className="relative">
                <CommentsIcon />
                {event.extra.admin_comment_count ? (
                  <span className="absolute rounded-full bg-red-400 top-[-15px] left-[60%] w-full text-white">
                    {event.extra.admin_comment_count}
                  </span>
                ) : null}
              </span>
            </ui.buttons.filled>

            <ui.buttons.filled
              onClick={() => setOpenedModal('removeModal')}
              className={cn('mt-4 col-span-2 md:w-fit')}
            >
              <TrashIcon />
            </ui.buttons.filled>

            <ui.buttons.filled
              onClick={() => {
                toggleIsStanding(event.event_id, event.track.id, !isStanding);
              }}
              className={cn('mt-4 col-span-2 whitespace-nowrap', { '!bg-amber-300': isStanding })}
            >
              {isStanding ? 'Снять зачет' : 'Зачет'}
            </ui.buttons.filled>

            {showAnalyticsButton && (
              <ui.buttons.expand
                chevronDirection={showGraph ? 'up' : 'down'}
                onClick={() => setShowGraph(!showGraph)}
                className="mt-4 border-gray-300 rounded-lg border w-full py-2 px-4 flex justify-center col-span-6 whitespace-nowrap"
              >
                Аналитика
              </ui.buttons.expand>
            )}
          </div>
        </div>
      </div>

      {showGraph && (
        <div className="mt-4 pt-4 border-t min-h-40">
          <ErrorBoundary fallbackRender={fallbackRender}>
            <Analytics track={event.track} />
          </ErrorBoundary>

          <ui.buttons.expand
            chevronDirection="up"
            onClick={() => setShowGraph(!showGraph)}
            className="mt-4 border-gray-300 rounded-lg border m-auto py-2 px-4 flex justify-center col-span-6 whitespace-nowrap"
          >
            Свернуть
          </ui.buttons.expand>
        </div>
      )}
      <RemoveActivityModal
        show={openedModal === 'removeModal'}
        name={event.track.user.full_name}
        date={event.track.start_date}
        distance={event.track.distance}
        handleClose={() => setOpenedModal(null)}
        handleDelete={() => {
          deleteTrack(event.event_id, event.track.id);
          setOpenedModal(null);
        }}
      />
      <CommentaryModal
        commentsCount={event.extra.admin_comment_count}
        handleClose={() => setOpenedModal(null)}
        handleSave={() => setOpenedModal(null)}
        show={openedModal === 'commentModal'}
        eventID={event.event_id}
        trackID={event.track.id}
      />
    </section>
  );
});

export { Card };
