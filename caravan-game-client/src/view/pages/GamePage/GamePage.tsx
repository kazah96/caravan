import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import * as R from 'remeda';
import { DrawCard } from './DrawCard';
import { MAP_VARIANT_TO_POINTS, TCard } from './base';

type Caravans = 'caravan1' | 'caravan2' | 'caravan3';

const GamePage = observer(function GamePage() {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>();

  const [hand, setHand] = useState<TCard[]>([
    { suit: 'clubs', variant: '2' },
    { suit: 'diamond', variant: '6' },
    { suit: 'diamond', variant: '6' },
  ]);

  const [caravans, setCaravans] = useState<Record<Caravans, TCard[]>>({
    caravan1: [{ suit: 'clubs', variant: '2' }],
    caravan2: [],
    caravan3: [],
  });

  return (
    <main className="w-full h-screen flex flex-col">
      <div className="flex flex-1">
        <SingleCaravan
          onCardClick={index => handleCaravanClick('caravan1', index)}
          caravan={caravans.caravan1}
        />
        <SingleCaravan
          onCardClick={index => handleCaravanClick('caravan2', index)}
          caravan={caravans.caravan2}
        />
        <SingleCaravan
          onCardClick={index => handleCaravanClick('caravan3', index)}
          caravan={caravans.caravan3}
        />
      </div>
      <div className="bg-slate-200 flex relative ">
        {hand.map((item, key) => (
          <div key={key} className="first:-ms-0 -ms-24 z-0">
            <DrawCard
              isSelected={selectedCardIndex === key}
              card={item}
              onClick={() => handleClickHandCard(key)}
            />
          </div>
        ))}
      </div>
    </main>
  );

  function handleCaravanClick(caravan: Caravans, caravanCardIndex: number) {
    if (R.isNumber(selectedCardIndex)) {
      const card = hand[selectedCardIndex];
      setHand(hand.filter((_, i) => i !== selectedCardIndex));
      setSelectedCardIndex(null);
      setCaravans({ ...caravans, [caravan]: [...caravans[caravan], card] });
    }
  }

  function handleClickHandCard(index: number) {
    setSelectedCardIndex(index);
  }

  // function handleClickHandCard(index: number) {
  //   const card = hand[index];
  //   setHand(hand.filter((_, i) => i !== index));
  //   setCaravan([...caravan, card]);
  // }
});

function calculateCaravanStrength(cards: TCard[]) {
  const totalPoints: number[] = [];

  cards.forEach(card => {
    const points = MAP_VARIANT_TO_POINTS[card.variant];

    if (card.variant === 'king' && totalPoints.length > 0) {
      totalPoints[totalPoints.length - 1] *= 2;
    } else {
      totalPoints.push(points);
    }
  });

  return R.sumBy(totalPoints, item => item);
}

function SingleCaravan(props: { caravan: TCard[]; onCardClick: (index: number) => void }) {
  const { caravan, onCardClick } = props;
  return (
    <div>
      <div>Strength: {calculateCaravanStrength(caravan)}</div>
      <div className="flex-1 flex flex-col">
        {caravan.length === 0 && <div onClick={() => onCardClick(0)}>Test</div>}
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
