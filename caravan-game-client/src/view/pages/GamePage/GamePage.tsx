/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import * as R from 'remeda';
import { useRootStore } from '@hooks/useRootStore';
import cn from 'classnames';
import { DrawCard } from './DrawCard';
import { Card, MAP_VARIANT_TO_POINTS } from '../../../model/base';

const GamePage = observer(function GamePage() {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>();
  const { gameStore } = useRootStore();

  const enemyCaravansList = Object.values(gameStore.enemyCaravans);
  const myCaravansList = Object.values(gameStore.myCaravans);

  return (
    <main
      className={cn('w-full h-screen flex flex-col p-6 content-between', {
        'pointer-events-none': !gameStore.isMyTurn,
      })}
    >
      <div
        className={cn('fixed top-[50%] select-none left-[40%] z-10 opacity-0 text-7xl font-bold ', {
          your_turn: gameStore.isMyTurn,
        })}
      >
        ВАШ ХОД
      </div>
      {!gameStore.isGameInitialized && (
        <div className={cn('fixed top-[50%] select-none left-[40%] z-10 text-7xl font-bold ')}>
          Ожидание игрока
        </div>
      )}
      {/* {gameStore.isMyTurn && <h1>I CAN MOVE</h1>} */}
      <h1 className="text-4xl mb-2">Караваны противника</h1>
      <div className="flex flex-1 bg-slate-100 p-4">
        {enemyCaravansList.map(value => (
          <SingleCaravan
            name={value.name}
            key={value.name}
            canAddCard={value.cards.length > 0}
            selectedCard={selectedCardIndex ? gameStore.myHand[selectedCardIndex] : undefined}
            onCardClick={index => handleCaravanClick(value.name, index)}
            cards={value.cards}
          />
        ))}
      </div>
      <h1 className="text-4xl my-4">Мои караваны</h1>
      <div className="flex flex-1 bg-slate-100 p-4">
        {myCaravansList.map(value => (
          <SingleCaravan
            key={value.name}
            name={value.name}
            canAddCard={
              value.cards.length === 0 ||
              myCaravansList
                .filter(caravan => caravan.name !== value.name)
                .every(caravan => caravan.cards.length > 0)
            }
            selectedCard={selectedCardIndex ? gameStore.myHand[selectedCardIndex] : undefined}
            onCardClick={index => handleCaravanClick(value.name, index)}
            cards={value.cards}
          />
        ))}
      </div>
      <div className="bg-slate-200 flex relative p-4">
        {gameStore.myHand.map((item, key) => (
          <div key={item.rank + item.suit} className="first:-ms-0 -ms-24 z-0">
            <DrawCard
              isSelected={selectedCardIndex === key}
              card={item}
              onClick={() => handleClickHandCard(key)}
            />
          </div>
        ))}
        <div className="ms-16 text-2xl border-2 select-none cursor-pointer border-gray-300 bg-white rounded-xl w-48 h-72 p-2 flex justify-between">
          Ещё карт: {gameStore.totalDeckCount}
        </div>
      </div>
    </main>
  );

  function handleCaravanClick(caravanName: string, caravanCardIndex: number) {
    if (R.isNumber(selectedCardIndex)) {
      const card = gameStore.myHand[selectedCardIndex];

      gameStore.sendSocketMessage({
        name: 'test',
        data: {
          command_name: 'put_card',
          data: {
            card,
            caravan_name: caravanName,
          },
        },
      });

      setSelectedCardIndex(null);
    }

    // if (R.isNumber(selectedCardIndex)) {
    //   setHand(hand.filter((_, i) => i !== selectedCardIndex));
    //   setSelectedCardIndex(null);
    //   setCaravans({ ...caravans, [caravan]: [...caravans[caravan], card] });
    // }
  }

  function handleClickHandCard(index: number) {
    setSelectedCardIndex(index);
  }
});

function calculateCaravanStrength(cards: Card[]) {
  const totalPoints: number[] = [];

  cards.forEach(card => {
    const points = MAP_VARIANT_TO_POINTS[card.rank];

    if (card.rank === 'KING' && totalPoints.length > 0) {
      totalPoints[totalPoints.length - 1] *= 2;
    } else {
      totalPoints.push(points);
    }
  });

  return R.sumBy(totalPoints, item => item);
}

function SingleCaravan(props: {
  name: string;
  cards: Card[];
  canAddCard: boolean;
  onCardClick: (index: number) => void;
  selectedCard?: Card;
}) {
  const [showSuggestedCard, setShowSuggestedCard] = useState(false);

  const { cards, onCardClick, name, selectedCard, canAddCard } = props;
  return (
    <div className={cn('min-w-56 bg-slate-100 relative flex-1')}>
      <h1 className="text-2xl">{name}</h1>
      <div>Strength: {calculateCaravanStrength(cards)}</div>

      <div
        className="flex-1 flex flex-col"
        onMouseEnter={() => setShowSuggestedCard(true)}
        onMouseLeave={() => setShowSuggestedCard(false)}
      >
        {cards.length === 0 && (
          <button
            className={cn(
              'border-4 select-none cursor-pointer border-gray-300 bg-white rounded-xl w-48 h-72 p-2 flex justify-between',
              { 'hover:border-red-300': !canAddCard },
            )}
            onClick={() => {
              if (canAddCard) {
                onCardClick(0);
              }
            }}
          />
        )}

        {cards.map((item, key) => (
          <div key={key} className="first:-mt-0 -mt-64 z-1" style={{ marginLeft: key * 20 }}>
            <DrawCard
              onClick={() => {
                if (canAddCard) {
                  onCardClick(key);
                }
              }}
              card={item}
            />
          </div>
        ))}

        {selectedCard && showSuggestedCard && (
          <div
            className={cn('first:-mt-0 mt-4 z-99 pointer-events-none absolute opacity-60', {
              'mt-0': cards.length === 0,
            })}
            style={{ marginLeft: cards.length * 20 }}
          >
            <DrawCard onClick={() => onCardClick(0)} card={selectedCard} />
          </div>
        )}
      </div>
    </div>
  );
}

export { GamePage };
