/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import cn from 'classnames';
import { DrawCard } from './DrawCard';
import { Card } from '../../../model/base';
import { calculateCaravanStrength, canPutCard } from './utils';

export function SingleCaravan(props: {
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
  const caravanStrength = calculateCaravanStrength(cards);
  // const multiplier = cards.length > 5 ? 20 : 20;
  return (
    <div className={cn('relative flex flex-col items-center')}>
      {headerPosition === 'top' && getHeader()}
      {dropCaravan && (
        <button
          type="button"
          disabled={!isMyTurn || cards.length === 0}
          className="px-2 w-full mb-4 disabled:opacity-40 border border-fallout-500 text-fallout-500"
          onClick={dropCaravan}
        >
          Сбросить
        </button>
      )}
      <div className="flex-1 flex flex-col mb-4">
        <div
          className={cn('playing-card relative  cursor-pointer border-fallout-300  rounded-xl ', {
            border: cards.length === 0,
            'border-red-400':
              showSuggestedCard && hoveredCard === null && selectedCard !== undefined && !canAdd,
            'border-green-400':
              showSuggestedCard && hoveredCard === null && selectedCard !== undefined && canAdd,
          })}
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
              className={cn(`absolute first:-mt-0 z-1 hover:-translate-y-2 transition-all`)}
              style={{
                transform: `rotate(${key * 10 - (cards.length - 1) * 5}deg)`,
                marginTop: `${key * 11}px`,
                marginLeft: `${key * 7}px`,
              }}
              // style={{ marginLeft: key * 2, marginTop: key * multiplier }}
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
    </div>
  );

  function getColorForCaravanStrength(caravanPoints: number) {
    if (caravanPoints < 21) {
      return 'text-fallout-200';
    }

    if (caravanPoints >= 21 && caravanPoints <= 26) {
      return 'text-green-400';
    }

    return 'text-red-400';
  }

  function getHeader() {
    return (
      <h1 className="mb-2 font-thin text-sm text-fallout-500 font-[NewLetterGotic] flex items-center">
        {name}:{' '}
        <span className={cn('ms-1', getColorForCaravanStrength(caravanStrength))}>
          {caravanStrength}
        </span>
      </h1>
    );
  }
}
