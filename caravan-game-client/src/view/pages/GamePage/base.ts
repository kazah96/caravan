export type CardSuit = 'diamond' | 'heart' | 'clubs' | 'spades';
export type CardVariant =
  | 'ace'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'jack'
  | 'queen'
  | 'king'
  | 'joker';

export const MAP_VARIANT_TO_VIEW: Record<CardVariant, string> = {
  ace: 'A',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
  jack: 'J',
  queen: 'Q',
  king: 'K',
  joker: 'Joker',
};

export const MAP_VARIANT_TO_POINTS: Record<CardVariant, number> = {
  ace: 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 0,
  jack: 0,
  queen: 0,
  king: 0,
  joker: 0,
};

export type TCard = {
  variant: CardVariant;
  suit: CardSuit;
};
