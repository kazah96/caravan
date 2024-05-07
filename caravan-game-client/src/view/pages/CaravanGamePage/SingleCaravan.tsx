/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import cn from 'classnames';
import { useDroppable } from '@dnd-kit/core';
import * as R from 'remeda';
import { useTranslation } from 'react-i18next';
import { DrawCard } from './DrawCard';
import { Card, CommandLog } from '../../../model/base';
import { calculateCaravanStrength, canPutCard } from './utils';

function Droppable(
  props: PropsWithChildren<{ disabled: boolean; index: number; card: Card; caravanName: string }>,
) {
  const { card, caravanName, index, disabled, children } = props;
  const { setNodeRef } = useDroppable({
    disabled,
    id: String(card.rank) + String(card.suit) + caravanName,
    data: { card, caravanName, index },
  });

  return React.cloneElement(children as ReactElement, { ref: setNodeRef });
}

export function SingleCaravan(props: {
  name: string;
  cards: Card[];
  selectedIndex?: number;
  areCaravansFilled: boolean;
  onCardClick: (index: number) => void;
  selectedCard?: Card;
  isMyTurn: boolean;
  dropCaravan?: () => void;
  isMyCaravan?: boolean;
  headerPosition?: 'top' | 'bottom';
  lastMove?: CommandLog;
}) {
  const [showSuggestedCard, setShowSuggestedCard] = useState(false);
  const { t } = useTranslation();
  const {
    cards,
    isMyTurn,
    selectedIndex,
    dropCaravan,
    onCardClick,
    name,
    selectedCard,
    areCaravansFilled,
    isMyCaravan,
    headerPosition,
    lastMove,
  } = props;
  const [caravanCards, setCaravanCards] = useState(cards);
  const [prevLastMove, setPrevLastMove] = useState(lastMove);

  const [animationDelayCaravanCards, setAnimationDelayCaravanCards] = useState(cards);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animateCardID, setAnimateCardID] = useState<null | number>(null);

  useEffect(() => {
    if (
      !R.isDeepEqual(prevLastMove, lastMove) &&
      prevLastMove !== lastMove &&
      !showAnimation &&
      lastMove?.command_name === 'put_card' &&
      lastMove.caravan_name === name &&
      isMyTurn
    ) {
      setShowAnimation(true);
      setAnimateCardID(lastMove?.card_in_caravan);

      setTimeout(() => {
        setShowAnimation(false);
        setPrevLastMove(lastMove);
        setAnimateCardID(null);
        setAnimationDelayCaravanCards(cards);
      }, 1500);
    } else if (!showAnimation) {
      setAnimationDelayCaravanCards(cards);
    }
  }, [lastMove, prevLastMove, showAnimation, name, isMyTurn, cards]);

  useEffect(() => {
    const newCards = [...animationDelayCaravanCards];

    if (
      lastMove &&
      lastMove.command_name === 'put_card' &&
      lastMove.caravan_name === name &&
      showAnimation
    ) {
      newCards.splice(lastMove.card_in_caravan + 1, 0, lastMove.card);
    }

    if (R.isNumber(selectedIndex) && selectedCard) {
      newCards.splice(selectedIndex + 1, 0, selectedCard);
    }

    setCaravanCards(newCards);
  }, [selectedIndex, selectedCard, lastMove, animationDelayCaravanCards, name, showAnimation]);

  const canAdd =
    selectedCard !== undefined &&
    canPutCard(selectedCard, 0, cards, isMyCaravan ?? false, areCaravansFilled);

  const caravanStrength = calculateCaravanStrength(cards);
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
          {t('game.discardCaravan')}
        </button>
      )}
      <div className="flex-1 flex flex-col mb-4">
        <Droppable
          disabled={!canAdd}
          caravanName={name}
          index={0}
          card={{ rank: 'ACE', suit: 'DIAMONDS' }}
        >
          <div
            className={cn('playing-card relative  cursor-pointer border-fallout-300  rounded-xl ', {
              border: cards.length === 0,
              'border-red-400': showSuggestedCard && selectedCard !== undefined && !canAdd,
              'border-green-400': showSuggestedCard && selectedCard !== undefined && canAdd,
            })}
            onClick={() => {
              if (cards.length === 0 && canAdd) {
                onCardClick(0);
              }
            }}
            onMouseUp={() => {
              if (cards.length === 0 && canAdd) {
                onCardClick(0);
              }
            }}
            onMouseEnter={() => setShowSuggestedCard(true)}
            onMouseLeave={() => setShowSuggestedCard(false)}
          >
            {caravanCards.map((item, key) => (
              <RenderCard
                areCaravansFilled={areCaravansFilled}
                cards={cards}
                index={key}
                isMyCaravan={isMyCaravan}
                item={item}
                name={name}
                key={key}
                selectedCard={selectedCard}
                selectedIndex={selectedIndex}
                dropInAnimation={animateCardID !== null && key === animateCardID + 1}
              />
            ))}
          </div>
        </Droppable>
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
        {t(`places.${name}`)}:{' '}
        <span className={cn('ms-1', getColorForCaravanStrength(caravanStrength))}>
          {caravanStrength}
        </span>
      </h1>
    );
  }
}

function RenderCard(props: {
  name: string;
  item: Card;
  index: number;
  areCaravansFilled: boolean;
  cards: Card[];
  selectedCard?: Card;
  isMyCaravan?: boolean;
  selectedIndex?: number;
  dropInAnimation?: boolean;
}) {
  const {
    areCaravansFilled,
    dropInAnimation,
    index,
    item,
    name,
    selectedCard,
    cards,
    isMyCaravan,
    selectedIndex,
  } = props;
  return (
    <Droppable
      caravanName={name}
      card={item}
      index={index}
      disabled={
        !(
          selectedCard &&
          canPutCard(selectedCard, index, cards, isMyCaravan ?? false, areCaravansFilled)
        )
      }
      key={index + item.rank + item.suit}
    >
      <div
        className={cn(`absolute first:-mt-0 z-1 hover:-translate-y-2 rotate-0 transition-all`, {
          // 'drop-in': dropInAnimation,
        })}
        style={{
          transform: `rotate(${index * 12 - (cards.length - 1) * 6}deg) scale(${selectedIndex !== undefined && selectedIndex + 1 === index ? 1.2 : 1})`,
          marginTop: `${index * 4}px`,
          transition: 'all .2s',
          marginLeft: `${index * 12}px`,
        }}
      >
        <div
          className={cn(``, {
            'drop-in': dropInAnimation,
          })}
        >
          <DrawCard index={index} card={item} />
        </div>
      </div>
    </Droppable>
  );
}
