import { Card, Players } from '@model/base';

export type GameData = {
  current_player: Players;
  hands: Record<string, Card[]>;
  decks: Record<string, Card[]>;
  state: number;
  current_turn: Players;
  caravans: Record<
    string,
    {
      name: string;
      cards: Card[];
      which: string;
    }
  >;
};

export type BaseClientSocketMessage<TType, TPayload> = {
  name: TType;
  data: TPayload;
};

export type PutCardActionMessage = BaseClientSocketMessage<
  'test',
  {
    command_name: 'put_card';
    data: {
      card: Card;
      caravan_name: string;
      card_in_caravan?: number;
    };
  }
>;

export type DropCaravanActionMessage = BaseClientSocketMessage<
  'test',
  {
    command_name: 'drop_caravan';
    data: {
      caravan_name: string;
    };
  }
>;

export type DropCardActionMessage = BaseClientSocketMessage<
  'test',
  {
    command_name: 'drop_card';
    data: {
      card_in_hand: Card;
    };
  }
>;

export type ClientSocketMessage =
  | PutCardActionMessage
  | DropCaravanActionMessage
  | DropCardActionMessage;
