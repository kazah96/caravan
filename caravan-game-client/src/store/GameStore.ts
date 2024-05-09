/* eslint-disable no-restricted-syntax */
import { makeObservable } from 'mobx';
import { AxiosResponse } from 'axios';
import { ApiStore } from './api/ApiStore';

export class GameStore {
  constructor(private readonly apiStore: ApiStore) {
    makeObservable(this, { createGame: true });
  }

  async createGame(isPublic = false) {
    const data = (await this.apiStore.post('/games/create', {
      is_private: !isPublic,
    })) as AxiosResponse<{
      game_id: string;
    }>;

    return data.data.game_id;
  }

  async getOpenRooms() {
    const data = await this.apiStore.get<string[]>('/games/open', {});

    return data.data;
  }
}
