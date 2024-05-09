/* eslint-disable no-restricted-syntax */
import { action, computed, makeObservable, observable } from 'mobx';
import { AxiosError, AxiosResponse } from 'axios';
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

  public async createUser(name: string, password: string) {
    const result = await this.apiStore.post<{ error?: string }>('/users/create', {
      name,
      password,
    });
    this.setIsLoading(false);
    return result.data;
  }

  public async loginUser(name: string, password: string) {
    try {
      const result = await this.apiStore.post<{ access_token: string }>('/users/login', {
        name,
        password,
      });
      localStorage.setItem('access_token', result.data.access_token);
      const user = await this.handleWhoami();

      return user;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          error: e.response?.data.detail,
        };
      }

      throw e;
    }
  }

  private async getWhoami() {
    const data = (await this.apiStore.get('/users/whoami', {})) as AxiosResponse<{
      name: string;
    }>;

    return { name: data.data.name };
  }

  async requestUsersStats() {
    const data = (await this.apiStore.get('/users/stat', {})) as AxiosResponse<
      { name: string; win: number; lose: number }[]
    >;

    this.setUserStats(data.data);
  }

  async handleWhoami() {
    this.setIsLoading(true);

    try {
      const user = await this.getWhoami();
      this.setUserName(user.name);

      return user;
    } catch (e) {
      console.error(e);
      this.setUserName('');
    } finally {
      this.setIsUserLoaded(true);
      this.setIsLoading(false);
    }
    return {};
  }

  @action.bound
  handleLogOff() {
    this.setIsUserLoaded(false);
    this.setUserName('');
    localStorage.removeItem('access_token');
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
