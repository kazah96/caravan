/* eslint-disable no-restricted-syntax */
import { action, computed, makeObservable, observable } from 'mobx';
import { Caravan, Card, Players } from '@model/base';
import { io, Socket } from 'socket.io-client';
import { isNumber, mapToObj } from 'remeda';

type GameData = {
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

type BaseClientSocketMessage<TType, TPayload> = {
  name: TType;
  data: TPayload;
};

type PutCardActionMessage = BaseClientSocketMessage<
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

type DropCaravanActionMessage = BaseClientSocketMessage<
  'test',
  {
    command_name: 'drop_caravan';
    data: {
      caravan_name: string;
    };
  }
>;

type DropCardActionMessage = BaseClientSocketMessage<
  'test',
  {
    command_name: 'drop_card';
    data: {
      card_in_hand: Card;
    };
  }
>;

type ClientSocketMessage = PutCardActionMessage | DropCaravanActionMessage | DropCardActionMessage;

export class GameStore {
  constructor() {
    makeObservable(this);
    this.socket.on('message', data => this.handleSocketMessage(data));
  }

  socket: Socket = io('/', {
    path: '/ws/socket.io',
    transports: ['websocket'],
  });

  @observable public myCaravans: Record<string, Caravan> = {};

  @observable public enemyCaravans: Record<string, Caravan> = {};

  @observable public myHand: Card[] = [];

  @observable public isGameInitialized = false;

  @observable public myPlayer: Players | null = null;

  @observable public currentTurn: Players = 'player1';

  @observable public currentState = 0;

  @observable totalDeckCount = 0;

  @computed public get gameState() {
    if (this.currentState === 0) {
      return 'playing';
    }

    if (this.currentState === 1) {
      if (this.myPlayer === 'player1') {
        return 'win';
      }

      return 'lose';
    }

    if (this.currentState === 2) {
      if (this.myPlayer === 'player2') {
        return 'win';
      }

      return 'lose';
    }
  }

  private initGame() {
    this.isGameInitialized = true;
  }

  @computed
  get isMyTurn() {
    return this.myPlayer === this.currentTurn;
  }

  @action.bound
  public handleSocketMessage(data: unknown) {
    const dataJson = JSON.parse(data as string) as {
      player_side: Players;
      name: string;
      payload: unknown;
    };
    switch (dataJson.name) {
      case 'acknowledge_player':
        this.myPlayer = dataJson.player_side as Players;
        break;
      case 'update_game_state':
        if (!this.isGameInitialized) {
          this.isGameInitialized = true;
        }
        this.handleUpdateGameData(dataJson.payload);
        break;
      default:
        break;
    }
  }

  public sendDropcaravanMessage(caravanName: string) {
    const dropcaravan: DropCaravanActionMessage = {
      name: 'test',
      data: {
        command_name: 'drop_caravan',
        data: {
          caravan_name: caravanName,
        },
      },
    };
    this.socket.emit('message', JSON.stringify(dropcaravan));
  }

  public sendDropCardMessage(card_index: number | undefined | null) {
    if (!isNumber(card_index)) {
      return;
    }

    const card = this.myHand[card_index];
    const dropCard: DropCardActionMessage = {
      name: 'test',
      data: {
        command_name: 'drop_card',
        data: {
          card_in_hand: card,
        },
      },
    };
    this.socket.emit('message', JSON.stringify(dropCard));
  }

  public sendSocketMessage(data: ClientSocketMessage) {
    this.socket.emit('message', JSON.stringify(data));
  }

  @action.bound
  private handleUpdateGameData(payload: unknown) {
    const gameData = payload as GameData;
    const myCaravans = mapToObj(
      Object.values(gameData.caravans).filter(caravan => caravan.which === this.myPlayer),
      caravan => [caravan.name, caravan],
    );

    this.myCaravans = myCaravans;
    this.myPlayer = gameData.current_player;

    const enemyCaravans = mapToObj(
      Object.values(gameData.caravans).filter(caravan => caravan.which !== this.myPlayer),
      caravan => [caravan.name, caravan],
    );
    this.currentState = gameData.state;
    this.currentTurn = gameData.current_turn;
    this.enemyCaravans = enemyCaravans;
    this.myHand = gameData.hands[this.myPlayer];
    this.totalDeckCount = gameData.decks[this.myPlayer].length;
  }
}
