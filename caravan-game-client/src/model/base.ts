export type CardSuit = 'DIAMONDS' | 'HEARTS' | 'CLUBS' | 'SPADES';

export type Players = 'player1' | 'player2';
export type CardRank =
  | 'ACE'
  | 'TWO'
  | 'THREE'
  | 'FOUR'
  | 'FIVE'
  | 'SIX'
  | 'SEVEN'
  | 'EIGHT'
  | 'NINE'
  | 'TEN'
  | 'JACK'
  | 'QUEEN'
  | 'KING';

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
