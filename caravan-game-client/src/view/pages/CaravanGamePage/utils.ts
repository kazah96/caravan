import { Card, MAP_VARIANT_TO_POINTS, POINT_CARD_RANKS } from '@model/base';
import * as R from 'remeda';

type CardsDirection = 'descending' | 'ascending' | null;

function getPointsOfCards(card: Card) {
  return MAP_VARIANT_TO_POINTS[card.rank];
}

function flipDirection(direction: CardsDirection) {
  if (direction === 'descending') {
    return 'ascending';
  }
  if (direction === 'ascending') {
    return 'descending';
  }
  return null;
}

export function getDirection(cards: Card[]): CardsDirection {
  if (cards.length < 2) {
    return null;
  }

  const { direction: currentDirection } = cards.reduce<{
    direction: CardsDirection;
    prevCard: Card | null;
  }>(
    (prevValue, card) => {
      const { direction, prevCard } = prevValue;

      if (!prevCard) {
        return { direction: null, prevCard: card };
      }

      if (card.rank === 'JACK' || card.rank === 'KING') {
        return prevValue;
      }

      if (card.rank === 'QUEEN') {
        return { direction: flipDirection(direction), prevCard };
      }

      if (getPointsOfCards(card) > getPointsOfCards(prevCard)) {
        return { direction: 'ascending', prevCard: card };
      }

      return { direction: 'descending', prevCard: card };
    },
    {
      direction: null,
      prevCard: null,
    },
  );

  return currentDirection;
}

function getLastPointCard(cards: Card[]): Card | undefined {
  const filteredCards = cards.filter(c => getPointsOfCards(c) > 0);
  const lastCard = R.last(filteredCards);

  return lastCard;
}

function canCardFitDirection(cards: Card[], card: Card): boolean {
  const direction = getDirection(cards);

  if (direction === null) {
    return true;
  }

  const lastCard = getLastPointCard(cards);
  if (!lastCard) {
    return true;
  }

  if (direction === 'ascending') {
    return getPointsOfCards(card) > getPointsOfCards(lastCard);
  }

  return getPointsOfCards(card) < getPointsOfCards(lastCard);
}

export function canPutCard(
  card: Card,
  cardInCaravanIndex: number | null,
  caravan: Card[],
  isMyCaravan: boolean,
  areCaravansFilled: boolean,
) {
  const isCardPointCard = isPointCard(card);

  if (!isMyCaravan) {
    if (!['JOKER', 'KING', 'JACK'].includes(card.rank)) {
      return false;
    }

    if (caravan.length < 2) {
      return false;
    }

    return true;
  }

  if (isCardPointCard) {
    const lastPointCard = getLastPointCard(caravan);

    if (caravan.length === 0) {
      return true;
    }

    if (cardInCaravanIndex !== caravan.length - 1) {
      return false;
    }

    // Не можем добавить если остались пустые караваны. Например нельзя положить 2 на 2
    if (!areCaravansFilled) {
      return false;
    }

    // Не можем добавить если карты равны. Например нельзя положить 2 на 2
    if (lastPointCard && lastPointCard.rank === card.rank) {
      return false;
    }

    // Можем добавить если масть равна
    if (lastPointCard && lastPointCard.suit === card.suit) {
      return true;
    }

    // Можем добавить если совпадает направление
    if (canCardFitDirection(caravan, card)) {
      return true;
    }
    return false;
  }

  if (!isCardPointCard) {
    // Нельзя положить спецкарту на пустой караван
    if (caravan.length === 0) {
      return false;
    }

    // Не имеет смысла ложить королеву куда-то кроме последней карты
    if (card.rank === 'QUEEN' && cardInCaravanIndex !== caravan.length - 1) {
      return false;
    }

    return true;
  }

  return false;
}

export function isPointCard(card: Card): boolean {
  return POINT_CARD_RANKS.includes(card.rank);
}
export function calculateCaravanStrength(cards: Card[]) {
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
