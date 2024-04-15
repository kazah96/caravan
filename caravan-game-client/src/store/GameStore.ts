import { action, computed, makeObservable, observable } from 'mobx';
import { Caravan, Card, Players } from '@model/base';
import { mapToObj } from 'remeda';
import { io, Socket } from 'socket.io-client';

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
    };
  }
>;

type ClientSocketMessage = PutCardActionMessage;

export class GameStore {
  constructor() {
    makeObservable(this);

    // this.socket.on('connection', () => this.initGame());
    this.socket.on('message', data => this.handleSocketMessage(data));

    // this.socket.socket?.addEventListener('open', () => this.initGame());
    // this.socket.socket?.addEventListener('message', data => this.handleSocketMessage(data));
  }

  socket: Socket = io('http://localhost:8000', {
    path: '/ws/socket.io',
    transports: ['websocket'],
  });

  @observable public myCaravans: Record<string, Caravan> = {};

  @observable public enemyCaravans: Record<string, Caravan> = {};

  @observable public myHand: Card[] = [];

  @observable public isGameInitialized = false;

  @observable public myPlayer: Players | null = null;

  @observable public currentTurn: Players = 'player1';

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

    this.currentTurn = gameData.current_turn;
    this.enemyCaravans = enemyCaravans;
    this.myHand = gameData.hands[this.myPlayer];
  }
}
