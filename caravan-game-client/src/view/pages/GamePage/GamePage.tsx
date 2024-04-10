import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import * as R from 'remeda';
import { useRootStore } from '@hooks/useRootStore';
import cn from 'classnames';
import { DrawCard } from './DrawCard';
import { Card, MAP_VARIANT_TO_POINTS } from '../../../model/base';

const GamePage = observer(function GamePage() {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>();
  const { socketStore, gameStore } = useRootStore();

  useEffect(() => {
    if (socketStore.isConnected) {
      // socketStore.socket?.send('');
    }
  }, [socketStore.isConnected, socketStore.socket]);

  return (
    <main
      className={cn('w-full h-screen flex flex-col p-6', {
        'pointer-events-none': !gameStore.isMyTurn,
      })}
    >
      <div
        className={cn(
          'fixed top-[50%] pointer-events-none select-none left-[40%] z-10 opacity-0 text-7xl font-bold ',
          {
            your_turn: gameStore.isMyTurn,
          },
        )}
      >
        ВАШ ХОД
      </div>
      {gameStore.isMyTurn && <h1>I CAN MOVE</h1>}
      {!socketStore.isConnected && <div>Loading</div>}
      <h1 className="text-2xl">Enymy Caravans</h1>
      <div className="flex flex-1">
        {Object.entries(gameStore.enemyCaravans).map(([key, value]) => (
          <SingleCaravan
            key={key}
            onCardClick={index => handleCaravanClick(key, index)}
            caravan={value.cards}
          />
        ))}
      </div>
      <h1 className="text-2xl">My Caravans</h1>
      <div className="flex flex-1">
        {Object.entries(gameStore.myCaravans).map(([key, value]) => (
          <SingleCaravan
            key={key}
            onCardClick={index => handleCaravanClick(key, index)}
            caravan={value.cards}
          />
        ))}
      </div>
      <div className="bg-slate-200 flex relative ">
        {gameStore.myHand.map((item, key) => (
          <div key={item.rank + item.suit} className="first:-ms-0 -ms-24 z-0">
            <DrawCard
              isSelected={selectedCardIndex === key}
              card={item}
              onClick={() => handleClickHandCard(key)}
            />
          </div>
        ))}
        <div className="ms-16 border-2 select-none cursor-pointer border-gray-300 bg-white rounded-xl w-48 h-72 p-2 flex justify-between">
          Total deck: {gameStore.totalDeckCount}
        </div>
      </div>
    </main>
  );

  function handleCaravanClick(caravanName: string, caravanCardIndex: number) {
    console.log(gameStore);
    if (R.isNumber(selectedCardIndex)) {
      const card = gameStore.myHand[selectedCardIndex];
      gameStore.sendSocketMessage({ type: 'PUT_CARD_ACTION', payload: { caravanName, card } });
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

    if (card.rank === 'king' && totalPoints.length > 0) {
      totalPoints[totalPoints.length - 1] *= 2;
    } else {
      totalPoints.push(points);
    }
  });

  return R.sumBy(totalPoints, item => item);
}

function SingleCaravan(props: { caravan: Card[]; onCardClick: (index: number) => void }) {
  const { caravan, onCardClick } = props;
  return (
    <div className="min-w-56 bg-slate-100">
      <div>Strength: {calculateCaravanStrength(caravan)}</div>
      <div className="flex-1 flex flex-col">
        {caravan.length === 0 && (
          <button
            className="border-2 select-none cursor-pointer border-gray-300 bg-white rounded-xl w-48 h-72 p-2 flex justify-between"
            onClick={() => onCardClick(0)}
          />
        )}
        {caravan.map((item, key) => (
          <div key={key} className="first:-mt-0 -mt-64 z-0" style={{ marginLeft: key * 20 }}>
            <DrawCard onClick={() => onCardClick(key)} card={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export { GamePage };
