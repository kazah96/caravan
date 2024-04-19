/* eslint-disable no-restricted-syntax */
import { action, computed, makeObservable, observable } from 'mobx';
import { AxiosResponse } from 'axios';
import { ApiStore } from './api/ApiStore';

export class UserStore {
  constructor(private readonly apiStore: ApiStore) {
    makeObservable(this);
  }

  @observable userName = '';

  @observable isLoading = false;

  @observable isUserLoaded = false;

  @observable userStats: { name: string; win: number; lose: number }[] = [];

  @computed public get isUser() {
    return this.isUserLoaded && !!this.userName;
  }

  private async createUser(name: string) {
    await this.apiStore.post('/users/create', { name });
    this.setIsLoading(false);
  }

  private async getWhoami() {
    const data = (await this.apiStore.get('/users/whoami', {})) as AxiosResponse<{
      name: string;
    }>;

    return data.data.name;
  }

  async requestUsersStats() {
    const data = (await this.apiStore.get('/users/stat', {})) as AxiosResponse<
      { name: string; win: number; lose: number }[]
    >;

    this.setUserStats(data.data);
  }

  async handleCreateUser(name: string) {
    this.setIsLoading(true);
    await this.createUser(name);
    await this.handleWhoami();
    this.setIsLoading(false);
  }

  async handleWhoami() {
    this.setIsLoading(true);

    try {
      const userName = await this.getWhoami();
      this.setUserName(userName);
    } catch (e) {
      console.error(e);
      this.setUserName('');
    }

    this.setIsUserLoaded(true);
    this.setIsLoading(false);
  }

  @action.bound
  setUserStats(data: { name: string; win: number; lose: number }[]) {
    this.userStats = data;
  }

  @action.bound
  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  @action.bound
  setIsUserLoaded(isLoaded: boolean) {
    this.isUserLoaded = isLoaded;
  }

  @action.bound
  setUserName(userName: string) {
    this.userName = userName;
  }
}
