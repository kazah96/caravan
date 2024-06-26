/* eslint-disable no-restricted-syntax */
import { action, computed, makeObservable, observable } from 'mobx';
import { Caravan, Card, CommandLog, Players } from '@model/base';
import { isArray, isNumber, mapToObj } from 'remeda';
import axios, { AxiosResponse } from 'axios';
import { GameData, User } from './messages';
import { ApiStore } from '../api/ApiStore';
import { UserStore } from '../UserStore';

export enum GameState {
  WAITING = 0,
  IN_GAME = 1,
  PLAYER_1_WON = 2,
  PLAYER_2_WON = 3,
}

type StateResponse = {
  state: 0 | 1 | 2 | 3;
  enemy: User;
  data?: GameData;
  logs: CommandLog[];
};

const MAP_STATE_NUMBER_TO_STATE = {
  0: GameState.WAITING,
  1: GameState.IN_GAME,
  2: GameState.PLAYER_1_WON,
  3: GameState.PLAYER_2_WON,
} as const;

export class CaravanStore {
  constructor(
    private readonly api: ApiStore,
    private readonly userStore: UserStore,
  ) {
    makeObservable(this);
  }

  @observable public myCaravans: Record<string, Caravan> = {};

  @observable public enemyCaravans: Record<string, Caravan> = {};

  @observable public myHand: Card[] = [];

  @observable public isGameInitialized = false;

  @observable public myPlayer: Players | null = null;

  @observable public currentTurn: Players = 'player1';

  @observable public currentState: GameState = GameState.WAITING;

  @observable public enemy: User | null = null;

  @observable totalDeckCount = 0;

  @observable gameID: string | null = null;

  @observable error = '';

  @observable logs: CommandLog[] = [];

  @computed public get gameState() {
    if (this.currentState === GameState.IN_GAME) {
      return 'playing';
    }

    if (this.currentState === GameState.PLAYER_1_WON) {
      if (this.myPlayer === 'player1') {
        return 'win';
      }

      return 'lose';
    }

    if (this.currentState === GameState.PLAYER_2_WON) {
      if (this.myPlayer === 'player2') {
        return 'win';
      }

      return 'lose';
    }
  }

  public getNameForPlayerSide = (playerSide: Players) => {
    if (this.myPlayer === playerSide) {
      return this.userStore.userName;
    }

    return this.enemy?.name;
  };

  public async initGame(gameId: string) {
    this.setGameInitialized(false);
    this.setError('');
    try {
      const data = (await this.api.get(`/games/join/${gameId}`)) as AxiosResponse<{
        player_side: Players;
      }>;
      this.myPlayer = data.data.player_side;
      this.setGameID(gameId);

      const initialStateResponse = (await this.api.get(
        `/caravan/${gameId}/get_state`,
      )) as AxiosResponse<StateResponse>;

      this.handleGetState(
        initialStateResponse.data.state,
        initialStateResponse.data.enemy,
        initialStateResponse.data.data,
      );
      this.handleLogs(initialStateResponse.data.logs);

      this.subscribeForUpdates(gameId);
      this.setGameInitialized(true);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.setError(`Error joining game: ${String(e.response?.data.detail)}`);
      } else {
        throw e;
      }
    }

    // this.isGameInitialized = true;
  }

  async subscribeForUpdates(gameId: string) {
    let flag = true;
    while (flag) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const stateResponse = (await this.api.get(
          `/caravan/${gameId}/subscribe_for_updates`,
        )) as AxiosResponse<StateResponse>;

        this.handleGetState(
          stateResponse.data.state,
          stateResponse.data.enemy,
          stateResponse.data.data,
        );
        this.handleLogs(stateResponse.data.logs);
      } catch {
        this.setGameInitialized(false);
        this.setError('Game has been closed');
        flag = false;
        break;
      }
    }
  }

  @action.bound
  handleLogs(logs: CommandLog[]) {
    if (isArray(logs)) {
      this.logs = logs;
    } else {
      this.logs = [];
    }
  }

  @action.bound
  setGameInitialized(flg: boolean) {
    this.isGameInitialized = flg;
  }

  @action.bound
  setGameID(gameId: string) {
    this.gameID = gameId;
  }

  @action.bound
  private handleGetState(state: 0 | 1 | 2 | 3, enemy: User, data?: GameData) {
    this.currentState = MAP_STATE_NUMBER_TO_STATE[state];
    if (enemy) {
      this.enemy = enemy;
    }
    if (data) {
      this.handleUpdateGameData(data);
    }
  }

  @action.bound
  setError(error: string) {
    this.error = error;
  }

  @computed
  get isMyTurn() {
    return this.myPlayer === this.currentTurn;
  }

  public async sendDropcaravanMessage(caravanName: string) {
    try {
      await this.api.post(`/caravan/${this.gameID}/discard_caravan`, {
        caravan_name: caravanName,
      });
    } catch (e) {
      this.setError('Error');
    }
  }

  public async requestRematch() {
    this.api.get(`/caravan/${this.gameID}/rematch`);
  }

  @action.bound
  public removeCard(index: number) {
    const newCards = [...this.myHand];

    if (isNumber(index)) {
      newCards.splice(index, 1);
    }

    this.myHand = newCards;
  }

  public async sendDropCardMessage(card_index: number | undefined | null) {
    if (!isNumber(card_index)) {
      return;
    }

    const card = this.myHand[card_index];

    try {
      await this.api.post(`/caravan/${this.gameID}/discard_card`, {
        card,
      });
    } catch (e) {
      this.setError('Error');
    }
  }

  @action.bound
  public addCardToCaravanList(card: Card, caravanName: string, cardInCaravan: number) {
    if (caravanName in this.myCaravans) {
      const newCaravanCards = [...this.myCaravans[caravanName].cards];
      newCaravanCards.splice(cardInCaravan + 1, 0, card);
      this.myCaravans[caravanName].cards = newCaravanCards;
    }
  }

  public async sendPutCardMessage(
    card: Card,
    caravanName: string,
    cardInCaravan: number | undefined,
  ) {
    const data = {
      card,
      caravan_name: caravanName,
      card_in_caravan: cardInCaravan,
    };

    try {
      await this.api.post(`/caravan/${this.gameID}/put_card`, data);
    } catch (e) {
      this.setError('Error');
    }
  }

  @action.bound
  private handleUpdateGameData(payload: unknown) {
    if (!this.myPlayer) {
      throw new Error('No player side');
    }
    const gameData = payload as GameData;
    const myCaravans = mapToObj(
      Object.values(gameData.caravans).filter(caravan => caravan.which === this.myPlayer),
      caravan => [caravan.name, caravan],
    );

    this.myCaravans = myCaravans;

    const enemyCaravans = mapToObj(
      Object.values(gameData.caravans).filter(caravan => caravan.which !== this.myPlayer),
      caravan => [caravan.name, caravan],
    );
    this.currentTurn = gameData.current_turn;
    this.enemyCaravans = enemyCaravans;
    this.myHand = gameData.hands[this.myPlayer];
    this.totalDeckCount = gameData.decks[this.myPlayer].length;
  }
}
