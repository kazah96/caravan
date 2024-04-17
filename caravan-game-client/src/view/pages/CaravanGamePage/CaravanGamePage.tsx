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
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { DrawCard } from './DrawCard';
import { Card } from '../../../model/base';
import { calculateCaravanStrength, canPutCard } from './utils';

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
      <div className="text-xl fixed top-[50%] left-[40%]  z-50 bg-red-200 p-20">
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
      className={cn('w-full h-screen flex flex-col py-8 px-10 content-between font-[Monofonto]', {
        // 'pointer-events-none': !caravanStore.isMyTurn || caravanStore.gameState !== 'playing',
      })}
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
      {!caravanStore.isGameInitialized && (
        <div className={cn('fixed top-[50%] select-none left-[40%] z-10 text-7xl font-bold ')}>
          Ожидание игрока
        </div>
      )}
      <div className="flex mb-6">
        <PipBoyWindow title="КАРАВАНЫ СОПЕРНИКА">
          <div className="flex justify-around">
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
                headerPosition="bottom"
              />
            ))}
          </div>
        </PipBoyWindow>
      </div>
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
            <div key={item.rank + item.suit} className="first:-ms-0 -ms-24 z-0">
              <DrawCard
                isSelected={selectedCardIndex === key}
                card={item}
                onClick={() => handleClickHandCard(key)}
              />
            </div>
          ))}
          <div className="relative ms-16 text-lg border-4 border-fallout-300 select-none cursor-pointer rounded-xl w-36 h-52 flex justify-between">
            <CogIcon style={{}} className="w-28 h-28 center-absolute" />
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

function SingleCaravan(props: {
  name: string;
  cards: Card[];
  areCaravansFilled: boolean;
  onCardClick: (index: number) => void;
  selectedCard?: Card;
  isMyTurn: boolean;
  dropCaravan?: () => void;
  isMyCaravan?: boolean;
  headerPosition?: 'top' | 'bottom';
}) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showSuggestedCard, setShowSuggestedCard] = useState(false);

  const {
    cards,
    isMyTurn,
    dropCaravan,
    onCardClick,
    name,
    selectedCard,
    areCaravansFilled,
    isMyCaravan,
    headerPosition,
  } = props;

  const canAdd =
    selectedCard !== undefined &&
    canPutCard(selectedCard, hoveredCard, cards, isMyCaravan ?? false, areCaravansFilled);

  const cardHighlight = canAdd ? 'green' : 'red';
  return (
    <div className={cn('relative flex flex-col items-center')}>
      {headerPosition === 'top' && getHeader()}
      <div className="flex-1 flex flex-col mb-4">
        <div
          className={cn(
            'w-32 h-52 relative border cursor-pointer border-fallout-300  rounded-xl ',
            {
              'border-red-400':
                showSuggestedCard && hoveredCard === null && selectedCard !== undefined && !canAdd,
              'border-green-400':
                showSuggestedCard && hoveredCard === null && selectedCard !== undefined && canAdd,
            },
          )}
          onClick={() => {
            if (cards.length === 0 && canAdd) {
              onCardClick(0);
            }
          }}
          onMouseEnter={() => setShowSuggestedCard(true)}
          onMouseLeave={() => setShowSuggestedCard(false)}
        >
          {cards.map((item, key) => (
            <div
              key={key}
              className="first:-mt-0 -mt-48 z-1"
              style={{ marginLeft: key * 30 }}
              onMouseEnter={() => setHoveredCard(key)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <DrawCard
                onClick={() => {
                  if (canAdd) {
                    onCardClick(key);
                  }
                }}
                highlight={hoveredCard !== null ? cardHighlight : undefined}
                card={item}
              />
            </div>
          ))}
          {/* 
          {selectedCard && showSuggestedCard && (
            <div
              className={cn('z-99 top-0 left-0 pointer-events-none absolute opacity-60', {
                'mt-0': cards.length === 0,
              })}
              style={{ marginLeft: cards.length * 20 }}
            >
              <DrawCard onClick={() => onCardClick(0)} card={selectedCard} />
            </div>
          )} */}
        </div>
      </div>
      {headerPosition === 'bottom' && getHeader()}
      {dropCaravan && (
        <button
          disabled={!isMyTurn || cards.length === 0}
          className="px-2 w-full mt-2 disabled:opacity-40 border border-fallout-500 text-fallout-500"
          onClick={dropCaravan}
        >
          Сбросить караван
        </button>
      )}
    </div>
  );

  function getHeader() {
    return (
      <h1 className="mb-2 font-thin text-fallout-500 font-[NewLetterGotic] flex items-center">
        {name}: <span className="text-blue-400 ms-1">{calculateCaravanStrength(cards)}</span>
      </h1>
    );
  }
}

export { CaravanGamePage };
