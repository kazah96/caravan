/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import * as R from 'remeda';
import { useRootStore } from '@hooks/useRootStore';
import cn from 'classnames';
import { useParams } from 'react-router-dom';
import { GameState } from '@store/caravanStore/CaravanStore';
import { PipBoyWindow } from '@components/ui/PipBoyWindow';
import { Modal } from '@components/ui/utils/modal';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CopyToClipboard } from 'react-copy-to-clipboard';
// import { CARD_RANK_LIST, CARD_SUIT_LIST } from '@model/base';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import { SingleCaravan } from './SingleCaravan';
import { BottomPanel } from './BottomPanel';

// function generateRandomCard() {
//   return {
//     suit: CARD_SUIT_LIST[Math.floor(Math.random() * CARD_SUIT_LIST.length)],
//     rank: CARD_RANK_LIST[Math.floor(Math.random() * CARD_RANK_LIST.length)],
//   };
// }

// function generateRandomCards(number: number) {
//   const cards = [];
//   for (let i = 0; i < number; i += 1) {
//     cards.push(generateRandomCard());
//   }
//   return cards;
// }

const CaravanGamePage = observer(function GamePage() {
  const params = useParams();
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>();
  const { caravanStore } = useRootStore();
  const [ev, setEv] = useState<{ index: number; caravanName: string } | null>(null);
  const { t } = useTranslation();
  const enemyCaravansList = Object.values(caravanStore.enemyCaravans);
  const myCaravansList = Object.values(caravanStore.myCaravans);

  useEffect(() => {
    if (params.id) {
      caravanStore.initGame(params.id);
    }
  }, [caravanStore, params.id]);

  useEffect(() => {
    setSelectedCardIndex(null);
  }, [caravanStore.currentTurn]);
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 0,
      tolerance: 5,
    },
  });
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  const sensors = useSensors(touchSensor, mouseSensor);

  if (caravanStore.error) {
    return (
      <Modal show onHide={() => {}}>
        <div className="flex flex-col items-center justify-center h-full fallout-font">
          <h1 className="text-4xl text-red-500 px-4 mb-2">{t('game.notFound')}</h1>
          <h2 className="text-xl text-fallout-500 px-4 mb-2">{t('game.maybeClosed')}</h2>
        </div>
      </Modal>
    );
  }

  const showAwaitPlayerModal =
    !caravanStore.isGameInitialized || caravanStore.currentState === GameState.WAITING;
  const showLoseModal = caravanStore.gameState === 'lose';
  const showWinModal = caravanStore.gameState === 'win';

  return (
    <DndContext
      onDragMove={e => e.activatorEvent.preventDefault()}
      onDragStart={e => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setSelectedCardIndex(e?.active?.data?.current?.index);
      }}
      onDragOver={e => {
        if (e.collisions && e.collisions.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const data = e.collisions[0].data?.droppableContainer?.data.current as {
            index: number;
            caravanName: string;
          };
          if (data) {
            const { index } = data;
            const { caravanName } = data;
            setEv({ index, caravanName });
          }
        } else {
          setEv(null);
        }
      }}
      onDragEnd={e => {
        setSelectedCardIndex(null);
        setEv(null);
        if (e.collisions && e.collisions.length > 0) {
          if (e.collisions[0].id === 'Cog') {
            handleDropCardClick();
            return;
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const data = e.collisions[0].data?.droppableContainer?.data.current as {
            index: number;
            caravanName: string;
          };
          if (data) {
            const { index } = data;
            const { caravanName } = data;
            handleCaravanClick(caravanName, index);
          }
        }
      }}
      autoScroll={{ layoutShiftCompensation: false }}
      sensors={sensors}
    >
      <main
        className={cn(
          'touch-manipulation w-full overflow-hidden min-h-[99vh] flex flex-col py-4 md:py-8 px-2 lg:px-10 content-between font-[Monofonto] max-w-screen-lg mx-auto',
          {},
        )}
      >
        <div
          className={cn(
            'fixed select-none pointer-events-none center-absolute z-10 opacity-0 text-5xl font-bold text-fallout-200 fallout-menu-background',
            {
              your_turn: caravanStore.gameState === 'playing' && caravanStore.isMyTurn,
            },
          )}
        >
          {t('game.yourTurn')}
        </div>
        <div className="flex mb-6 flex-1">
          <PipBoyWindow
            title={
              <span className="uppercase">
                {t('game.enemyCaravans', { name: caravanStore.enemy?.name })}
              </span>
            }
            titleContent={
              <span
                className={cn('w-2 h-2 ms-2 rounded inline-block shadow', {
                  'bg-gray-500': caravanStore.isMyTurn,
                  'bg-green-500': !caravanStore.isMyTurn,
                })}
              />
            }
          >
            <div className="flex justify-around h-fit items-end">
              {enemyCaravansList.map(value => (
                <SingleCaravan
                  name={value.name}
                  selectedIndex={
                    ev?.caravanName === value.name && ev?.index !== null ? ev?.index : undefined
                  }
                  key={value.name}
                  isMyTurn={caravanStore.isMyTurn}
                  areCaravansFilled={value.cards.length > 0}
                  selectedCard={
                    R.isNumber(selectedCardIndex)
                      ? caravanStore.myHand[selectedCardIndex]
                      : undefined
                  }
                  onCardClick={index => handleCaravanClick(value.name, index)}
                  cards={value.cards}
                  // cards={generateRandomCards(7)}
                  headerPosition="top"
                />
              ))}
            </div>
          </PipBoyWindow>
        </div>
        <div className="flex-1 flex">
          <PipBoyWindow
            title={<span>{t('game.myCaravans')}</span>}
            titleContent={
              <span
                className={cn('w-2 h-2 ms-2 rounded inline-block shadow', {
                  'bg-gray-500': !caravanStore.isMyTurn,
                  'bg-green-500': caravanStore.isMyTurn,
                })}
              />
            }
          >
            <div
              className={cn('flex justify-around', {
                'pointer-events-none':
                  !caravanStore.isMyTurn || caravanStore.gameState !== 'playing',
              })}
            >
              {myCaravansList.map(value => (
                <SingleCaravan
                  key={value.name}
                  name={value.name}
                  selectedIndex={
                    ev?.caravanName === value.name && ev?.index !== null ? ev?.index : undefined
                  }
                  isMyTurn={caravanStore.isMyTurn}
                  areCaravansFilled={myCaravansList
                    .filter(caravan => caravan.name !== value.name)
                    .every(caravan => caravan.cards.length > 0)}
                  selectedCard={
                    R.isNumber(selectedCardIndex)
                      ? caravanStore.myHand[selectedCardIndex]
                      : undefined
                  }
                  onCardClick={index => handleCaravanClick(value.name, index)}
                  cards={value.cards}
                  // cards={generateRandomCards(3)}
                  dropCaravan={() => {
                    caravanStore.sendDropcaravanMessage(value.name);
                  }}
                  isMyCaravan
                  headerPosition="top"
                />
              ))}
            </div>
          </PipBoyWindow>
        </div>
        <BottomPanel
          selectedCardIndex={selectedCardIndex ?? null}
          handleClickHandCard={handleClickHandCard}
        />
        <Modal show={showAwaitPlayerModal} onHide={() => {}}>
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl text-fallout-500 px-4 mb-2">{t('game.awaitForPlayer')}</h1>
            <CopyToClipboard text={window.location.href}>
              <span className="text-lg text-fallout-500 border px-2 border-fallout-500 cursor-pointer hover:underline">
                {t('game.copyLink')}
              </span>
            </CopyToClipboard>
            {navigator.share && (
              <button
                className="text-fallout-500"
                onClick={() => {
                  navigator.share({
                    url: window.location.href,
                    title: 'Сыграй в караван',
                    text: 'Сыграй в караван',
                  });
                }}
              >
                Share
              </button>
            )}
          </div>
        </Modal>
        <Modal show={showLoseModal} onHide={() => {}}>
          <div className="flex items-center justify-center h-full">
            <h1 className="text-4xl text-fallout-500 px-4 mb-2">{t('game.youLost')}</h1>
          </div>
        </Modal>
        <Modal show={showWinModal} onHide={() => {}}>
          <div className="flex items-center justify-center h-full">
            <h1 className="text-4xl text-fallout-500 px-4 mb-2">{t('game.youWin')}</h1>
          </div>
        </Modal>
      </main>
    </DndContext>
  );

  function handleDropCardClick() {
    if (R.isNumber(selectedCardIndex)) {
      caravanStore.sendDropCardMessage(selectedCardIndex);
      caravanStore.removeCard(selectedCardIndex);
    }
    setTimeout(() => {}, 500);

    setTimeout(() => {}, 500);
  }

  function handleCaravanClick(caravanName: string, caravanCardIndex: number) {
    if (R.isNumber(selectedCardIndex)) {
      const card = caravanStore.myHand[selectedCardIndex];

      caravanStore.sendPutCardMessage(card, caravanName, caravanCardIndex);
      caravanStore.addCardToCaravanList(card, caravanName, caravanCardIndex);

      setSelectedCardIndex(null);
    }
  }

  function handleClickHandCard(index: number) {
    setSelectedCardIndex(index);
  }
});

export { CaravanGamePage };
