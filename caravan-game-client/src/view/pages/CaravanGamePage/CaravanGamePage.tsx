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
  if (!caravanStore.isGameInitialized) {
    return (
      <div className="text-xl fixed top-[50%] left-[40%]  z-50 bg-yellow-200 p-20">
        Wait for game
      </div>
    );
  }

  return (
    <main
      className={cn('w-full h-screen flex flex-col p-4 content-between', {
        'pointer-events-none': !caravanStore.isMyTurn || caravanStore.gameState !== 'playing',
      })}
    >
      {caravanStore.currentState === GameState.WAITING && (
        <div className="fixed top-[50%] left-[40%]  z-50 bg-yellow-200 p-20">
          <h1 className="text-xl mb-2">{caravanStore.gameState} Waiting for player</h1>
          <h2 className="text-lg">Use this url to connect to the game:</h2>
          <h2 className="text-lg">{window.location.href}</h2>
        </div>
      )}
      {(caravanStore.currentState === GameState.PLAYER_1_WON ||
        caravanStore.currentState === GameState.PLAYER_2_WON) && (
        <div className="fixed top-[50%] left-[40%]  z-50 bg-yellow-200 p-20">
          <h1 className="text-2xl mb-2">{caravanStore.gameState}</h1>
        </div>
      )}
      <div
        className={cn(
          'fixed top-[50%] select-none pointer-events-none left-[40%] z-10 opacity-0 text-7xl font-bold ',
          {
            your_turn: caravanStore.isMyTurn,
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
      {/* {caravanStore.isMyTurn && <h1>I CAN MOVE</h1>} */}
      <h1 className="text-xl mb-2">Караваны противника</h1>
      <div className="flex flex-1 bg-slate-100 p-4">
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
          />
        ))}
      </div>
      <h1 className="text-xl my-4">Мои караваны</h1>
      <div className="flex flex-1 bg-slate-100 p-4">
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
          />
        ))}
      </div>
      <div className="bg-slate-200 flex relative p-4">
        {caravanStore.myHand.map((item, key) => (
          <div key={item.rank + item.suit} className="first:-ms-0 -ms-24 z-0">
            <DrawCard
              isSelected={selectedCardIndex === key}
              card={item}
              onClick={() => handleClickHandCard(key)}
            />
          </div>
        ))}
        <div className="ms-16 text-lg border-2 select-none cursor-pointer border-gray-300 bg-white rounded-xl w-36 h-52 p-2 flex justify-between">
          Ещё карт: {caravanStore.totalDeckCount}
        </div>
        <div id="button-holder" className="ms-4">
          <button
            disabled={!caravanStore.isMyTurn || !R.isNumber(selectedCardIndex)}
            onClick={() => caravanStore.sendDropCardMessage(selectedCardIndex)}
            className="text-lg border-2 border-gray-400 rounded-xl p-4 cursor-pointer hover:bg-slate-300 disabled:opacity-30"
          >
            Сбросить выбранную карту
          </button>
        </div>
      </div>
    </main>
  );

  function handleCaravanClick(caravanName: string, caravanCardIndex: number) {
    if (R.isNumber(selectedCardIndex)) {
      const card = caravanStore.myHand[selectedCardIndex];

      console.log('Send');
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
  } = props;

  const canAdd =
    selectedCard !== undefined &&
    canPutCard(selectedCard, hoveredCard, cards, isMyCaravan ?? false, areCaravansFilled);

  const cardHighlight = canAdd ? 'green' : 'red';
  return (
    <div className={cn('min-w-56 bg-slate-100 relative flex-1')}>
      <h1 className="text-lg font-semibold mb-2">
        {name}: <span className="text-blue-400 me-2">{calculateCaravanStrength(cards)}</span>
        {dropCaravan && (
          <button
            disabled={!isMyTurn || cards.length === 0}
            className="border-2 border-gray-400 px-2 rounded-md ms-2 disabled:opacity-25"
            onClick={dropCaravan}
          >
            Сбросить
          </button>
        )}
      </h1>
      <div className="flex-1 flex flex-col">
        <div
          className={cn(
            'w-36 h-52 relative border-2 cursor-pointer border-gray-300 bg-white rounded-xl ',
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
    </div>
  );
}

export { CaravanGamePage };
