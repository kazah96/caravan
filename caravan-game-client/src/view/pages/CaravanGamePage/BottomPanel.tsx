/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRootStore } from '@hooks/useRootStore';
import { PipBoyWindow } from '@components/ui/PipBoyWindow';
import { observer } from 'mobx-react-lite';
import cn from 'classnames';
import { Modal } from '@components/ui/utils/modal';
import CogIcon from '@assets/icons/cogwheel.svg?react';
import TrashIcon from '@assets/icons/Trash/Trash 2.svg?react';
import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import * as R from 'remeda';
import { CaravanStore } from '@store/caravanStore/CaravanStore';
import { DrawCard } from './DrawCard';

type Props = {
  selectedCardIndex: number | null;
  handleClickHandCard: (key: number) => void;
};

const BottomPanel = observer(function BottomPanel(props: Props) {
  const { caravanStore } = useRootStore();
  const { handleClickHandCard, selectedCardIndex } = props;
  // const cogElementRef = useRef<HTMLDivElement>(null);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // const cogRect = cogElementRef.current?.getBoundingClientRect();

  return (
    <>
      <PipBoyWindow
        className="mt-8"
        buttons={[
          { callback: () => {}, label: 'Покинуть игру' },
          { callback: () => setShowHelp(true), label: 'Как играть то?' },
        ]}
      >
        <div
          className={cn('flex relative p-4 justify-center', {
            // 'pointer-events-none': !caravanStore.isMyTurn || caravanStore.gameState !== 'playing',
          })}
        >
          {caravanStore.myHand.map((item, key) => (
            <div
              id={`card-${key}`}
              key={item.rank + item.suit}
              className={cn(
                'first:-ms-0 -ms-8 lg:-ms-14 relative left-0 transition-all duration-600',
              )}
              // style={{
              //   left: selectedCardIndex === key && isClicked === key ? countDistance(key) : 0,
              // }}
            >
              <DrawCard
                isSelected={selectedCardIndex === key}
                index={key}
                card={item}
                needDrag={caravanStore.isMyTurn}
                onClick={() => handleClickHandCard(key)}
              />
            </div>
          ))}

          <Cog selectedCardIndex={selectedCardIndex ?? undefined} caravanStore={caravanStore} />
        </div>
      </PipBoyWindow>
      <Modal show={showHelp} onHide={() => setShowHelp(false)}>
        <div className="flex flex-col items-center justify-center h-full text-fallout-500 ">
          <h1 className="text-4xl px-4 mb-2">Как играть?</h1>
          <p>* Сам без понятия, в ютубе посмотри</p>
        </div>
      </Modal>
    </>
  );

  // function countDistance(card_number: number) {
  //   const card = document.getElementById(`card-${card_number}`);
  //   const cardLeft = card ? card?.getBoundingClientRect().left : 0;

  //   return (cogRect?.left ?? 0) - cardLeft;
  // }
});

export { BottomPanel };

function Cog(props: { selectedCardIndex?: number; caravanStore: CaravanStore }) {
  const { selectedCardIndex, caravanStore } = props;

  const { setNodeRef, isOver } = useDroppable({
    id: 'Cog',
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative ms-4 text-lg border-4 border-fallout-300 select-none cursor-pointer rounded-xl playing-card flex justify-between hover:bg-red-400',
      )}
    >
      <div className="center-absolute">
        {!R.isNumber(selectedCardIndex) ? (
          <CogIcon
            style={{}}
            className={cn('w-16 h-16 lg:w-20 lg:h-20 ', {
              'animate-spin-slow': caravanStore.isMyTurn && caravanStore.gameState === 'playing',
            })}
          />
        ) : (
          <TrashIcon
            style={{}}
            className={cn('transition-transform w-16 h-16 lg:w-20 lg:h-20 ', {
              'scale-150': isOver,
            })}
          />
        )}
      </div>
      {!R.isNumber(selectedCardIndex) && (
        <span style={{}} className="center-absolute text-fallout-200 text-2xl">
          {caravanStore.totalDeckCount}
        </span>
      )}
    </div>
  );
}
