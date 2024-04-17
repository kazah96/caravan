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
import CogIcon from '@assets/icons/cogwheel.svg?react';
import { Modal } from '@components/ui/utils/modal';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CopyToClipboard } from 'react-copy-to-clipboard';
// import { CARD_RANK_LIST, CARD_SUIT_LIST } from '@model/base';
import { DrawCard } from './DrawCard';
import { SingleCaravan } from './SingleCaravan';

// function generateRandomCard() {
//   return {
//     suit: CARD_SUIT_LIST[Math.floor(Math.random() * CARD_SUIT_LIST.length) - 1],
//     rank: CARD_RANK_LIST[Math.floor(Math.random() * CARD_RANK_LIST.length) - 1],
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

  const enemyCaravansList = Object.values(caravanStore.enemyCaravans);
  const myCaravansList = Object.values(caravanStore.myCaravans);

  useEffect(() => {
    if (params.id) {
      caravanStore.initGame(params.id);
    }
  }, [caravanStore, params.id]);

  if (caravanStore.error) {
    return (
      <div className="text-xl fixed top-[50%] left-[40%]  z-50 bg-red-200 p-20 ">
        {caravanStore.error}
      </div>
    );
  }

  const showAwaitPlayerModal =
    !caravanStore.isGameInitialized || caravanStore.currentState === GameState.WAITING;
  const showLoseModal = caravanStore.gameState === 'lose';
  const showWinModal = caravanStore.gameState === 'win';

  return (
    <main
      className={cn(
        'w-full flex flex-col py-4 md:py-8 px-2 lg:px-10 content-between font-[Monofonto] max-w-screen-lg mx-auto',
        {
          // 'pointer-events-none': !caravanStore.isMyTurn || caravanStore.gameState !== 'playing',
        },
      )}
    >
      <div
        className={cn(
          'fixed select-none pointer-events-none center-absolute z-10 opacity-0 text-7xl font-bold text-fallout-200 fallout-menu-background',
          {
            your_turn: caravanStore.gameState === 'playing' && caravanStore.isMyTurn,
          },
        )}
      >
        ВАШ ХОД
      </div>
      <div className="flex mb-6 flex-1">
        <PipBoyWindow title="КАРАВАНЫ СОПЕРНИКА">
          <div className="flex justify-around h-fit items-end">
            {enemyCaravansList.map(value => (
              <SingleCaravan
                name={value.name}
                key={value.name}
                isMyTurn={caravanStore.isMyTurn}
                areCaravansFilled={value.cards.length > 0}
                selectedCard={
                  R.isNumber(selectedCardIndex) ? caravanStore.myHand[selectedCardIndex] : undefined
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
        <PipBoyWindow title="МОИ КАРАВАНЫ">
          <div
            className={cn('flex justify-around', {
              'pointer-events-none': !caravanStore.isMyTurn || caravanStore.gameState !== 'playing',
            })}
          >
            {myCaravansList.map(value => (
              <SingleCaravan
                key={value.name}
                name={value.name}
                isMyTurn={caravanStore.isMyTurn}
                areCaravansFilled={myCaravansList
                  .filter(caravan => caravan.name !== value.name)
                  .every(caravan => caravan.cards.length > 0)}
                selectedCard={
                  R.isNumber(selectedCardIndex) ? caravanStore.myHand[selectedCardIndex] : undefined
                }
                onCardClick={index => handleCaravanClick(value.name, index)}
                cards={value.cards}
                dropCaravan={() => caravanStore.sendDropcaravanMessage(value.name)}
                isMyCaravan
                headerPosition="top"
              />
            ))}
          </div>
        </PipBoyWindow>
      </div>
      <PipBoyWindow
        className="mt-8"
        buttons={[
          {
            callback: () => caravanStore.sendDropCardMessage(selectedCardIndex),
            label: 'Сбросить карту',
            disabled: !caravanStore.isMyTurn || !R.isNumber(selectedCardIndex),
          },
          { callback: () => {}, label: 'Покинуть игру' },
        ]}
      >
        <div
          className={cn('flex relative p-4 justify-center', {
            'pointer-events-none': !caravanStore.isMyTurn || caravanStore.gameState !== 'playing',
          })}
        >
          {caravanStore.myHand.map((item, key) => (
            <div key={item.rank + item.suit} className="first:-ms-0 z-0 -ms-8 lg:-ms-14 relative">
              <DrawCard
                isSelected={selectedCardIndex === key}
                card={item}
                onClick={() => handleClickHandCard(key)}
              />
            </div>
          ))}
          <div className="relative ms-4 text-lg border-4 border-fallout-300 select-none cursor-pointer rounded-xl playing-card flex justify-between">
            <CogIcon style={{}} className="w-16 h-16 lg:w-20 lg:h-20 center-absolute" />
            <span style={{}} className="center-absolute text-fallout-200 text-2xl">
              {caravanStore.totalDeckCount}
            </span>
          </div>
        </div>
      </PipBoyWindow>
      <Modal show={showAwaitPlayerModal} onHide={() => {}}>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl text-fallout-500 px-4 mb-2">Ожидание игрока</h1>
          <CopyToClipboard text={window.location.href}>
            <span className="text-lg text-fallout-500 border px-2 border-fallout-500 cursor-pointer hover:underline">
              Скопировать ссылку для друга
            </span>
          </CopyToClipboard>
        </div>
      </Modal>
      <Modal show={showLoseModal} onHide={() => {}}>
        <div className="flex items-center justify-center h-full">
          <h1 className="text-4xl text-fallout-500 px-4 mb-2">Вы проиграли</h1>
        </div>
      </Modal>
      <Modal show={showWinModal} onHide={() => {}}>
        <div className="flex items-center justify-center h-full">
          <h1 className="text-4xl text-fallout-500 px-4 mb-2">Вы победили</h1>
        </div>
      </Modal>
    </main>
  );

  function handleCaravanClick(caravanName: string, caravanCardIndex: number) {
    if (R.isNumber(selectedCardIndex)) {
      const card = caravanStore.myHand[selectedCardIndex];

      caravanStore.sendPutCardMessage(card, caravanName, caravanCardIndex);

      setSelectedCardIndex(null);
    }
  }

  function handleClickHandCard(index: number) {
    setSelectedCardIndex(index);
  }
});

export { CaravanGamePage };
