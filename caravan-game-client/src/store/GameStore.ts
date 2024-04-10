import { computed, makeObservable, observable } from 'mobx';
import { Caravan, Card, Players } from '@model/base';
import { mapToObj } from 'remeda';
import { WebsocketStore } from './api/WebsocketStore';

type GameData = {
  current_player: string;
  current_turn: Players;
  total_deck_count: number;
  hand: Card[];
  caravans: {
    name: string;
    cards: Card[];
    which: string;
  }[];
};

type BaseClientSocketMessage<TType, TPayload> = {
  type: TType;
  payload: TPayload;
};

type PutCardActionMessage = BaseClientSocketMessage<
  'PUT_CARD_ACTION',
  {
    card: Card;
    caravanName: string;
  }
>;

type ClientSocketMessage = PutCardActionMessage;

export class GameStore {
  constructor(private readonly socket: WebsocketStore) {
    makeObservable(this);

    this.socket.socket?.addEventListener('open', () => this.initGame());
    this.socket.socket?.addEventListener('message', data => this.handleSocketMessage(data));
  }

  @observable public myCaravans: Record<string, Caravan> = {};

  @observable public enemyCaravans: Record<string, Caravan> = {};

  @observable public myHand: Card[] = [];

  @observable public isGameInitialized = false;

  @observable public myPlayer: Players | null = null;

  @observable public currentTurn: Players = 'player1';

  @observable public totalDeckCount = 0;

  private initGame() {
    this.isGameInitialized = true;
  }

  @computed
  get isMyTurn() {
    return this.myPlayer === this.currentTurn;
  }

  public handleSocketMessage(data: MessageEvent<string>) {
    const dataJson = JSON.parse(data.data) as { type: string; payload: unknown };

    if (dataJson.type === 'UPDATE_GAME_DATA') {
      this.handleUpdateGameData(dataJson.payload);
    }
  }

  public sendSocketMessage(data: ClientSocketMessage) {
    this.socket.socket?.send(JSON.stringify(data));
  }

  private handleUpdateGameData(payload: unknown) {
    const gameData = payload as GameData;

    const myCaravans = mapToObj(
      gameData.caravans.filter(caravan => caravan.which === gameData.current_player),
      caravan => [caravan.name, caravan],
    );

    this.myPlayer = gameData.current_player as Players;

    this.myCaravans = myCaravans;

    const enemyCaravans = mapToObj(
      gameData.caravans.filter(caravan => caravan.which !== gameData.current_player),
      caravan => [caravan.name, caravan],
    );

    this.currentTurn = gameData.current_turn;
    this.enemyCaravans = enemyCaravans;
    this.totalDeckCount = gameData.total_deck_count;
    this.myHand = gameData.hand;
  }
}
