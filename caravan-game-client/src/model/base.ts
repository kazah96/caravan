export const CARD_SUIT_LIST = ['DIAMONDS', 'HEARTS', 'CLUBS', 'SPADES'] as const;
export type CardSuit = (typeof CARD_SUIT_LIST)[number];

export const CARD_RANK_LIST = [
  'ACE',
  'TWO',
  'THREE',
  'FOUR',
  'FIVE',
  'SIX',
  'SEVEN',
  'EIGHT',
  'NINE',
  'TEN',
  'JACK',
  'QUEEN',
  'KING',
] as const;

export type Players = 'player1' | 'player2';
export type CardRank = (typeof CARD_RANK_LIST)[number];

export type Card = {
  suit: CardSuit;
  rank: CardRank;
};

export type Caravan = {
  cards: Card[];
  name: string;
};

export const MAP_VARIANT_TO_VIEW: Record<CardRank, string> = {
  ACE: 'A',
  TWO: '2',
  THREE: '3',
  FOUR: '4',
  FIVE: '5',
  SIX: '6',
  SEVEN: '7',
  EIGHT: '8',
  NINE: '9',
  TEN: '10',
  JACK: 'J',
  QUEEN: 'Q',
  KING: 'K',
};

export const MAP_VARIANT_TO_POINTS: Record<CardRank, number> = {
  ACE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10,
  JACK: 0,
  QUEEN: 0,
  KING: 0,
};

export const POINT_CARD_RANKS = [
  'ACE',
  'ONE',
  'TWO',
  'THREE',
  'FOUR',
  'FIVE',
  'SIX',
  'SEVEN',
  'EIGHT',
  'NINE',
  'TEN',
];
