import { AxiosError, AxiosResponse } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { action, autorun, computed, makeObservable, observable } from 'mobx';

import type { RootStore } from '../RootStore';
import { transformLoginResult } from './dataTransform';
import { LoginResponse } from './types';
import { tokenHasExpired } from './utils';

type Errors = { email?: string[]; password?: string[] };
type LoginErrorResponse = { errors: { password: string[]; email: string[] } };

export class AuthStore {
  constructor(private readonly rootStore: RootStore) {
    makeObservable(this);

    this.checkAndSetAccessToken();

    autorun(() => {
      if (this.accessToken) {
        this.requireTrackerApiAccessToken();
      }
    });

    createAuthRefreshInterceptor(this.rootStore.apiStore.api, this.refreshAuthLogin, {
      statusCodes: [401, 403],
    });
  }

  @observable trackerApiAccessToken: string | null = window.localStorage.getItem(
    'tracker_api_access_token',
  );

  @observable refreshToken: string | null = window.localStorage.getItem('refresh_token');

  @observable accessToken: string | null = null;

  @observable errors: Errors = {};

  @observable userID: number | null = Number(window.localStorage.getItem('user_id'));

  refreshTokenPromise: Promise<string> | null = null;

  requireTrackerApiAccessToken = async () => {
    const res = await this.rootStore.apiStore.get<{ token: string }>('/token/services');
    this.setTrackerApiAccessToken(res.data.token);
  };

  @computed
  public get hasErrors() {
    return !!this.errors.email || !!this.errors.password;
  }

  @computed
  public get isLoggedIn() {
    return this.accessToken !== null;
  }

  refreshAuthLogin = async (failedRequest: { response: AxiosResponse }) => {
    const token = await this.doRefreshToken();
    if (token) {
      // eslint-disable-next-line no-param-reassign
      failedRequest.response.config.headers.Authorization = `Bearer ${token}`;
    }
  };

  @action.bound
  checkAndSetAccessToken() {
    const refreshToken = window.localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.logout();

      return;
    }

    this.refreshToken = refreshToken;
    const accessToken = window.localStorage.getItem('access_token');

    if (!accessToken || tokenHasExpired(accessToken)) {
      this.doRefreshToken();
    } else {
      this.accessToken = accessToken;
    }
  }

  doRefreshToken = async () => {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }
    const promise = new Promise<string>(resolve => {
      this.rootStore.apiStore
        .post<LoginResponse>('/auth/refresh/', {
          refresh_token: this.refreshToken,
        })
        .then(res => {
          this.setAccessToken(res.data.token);
          this.setRefreshToken(res.data.refresh_token);
          resolve(res.data.token);
        })
        .catch(() => {
          this.logout();
        });
    });

    this.refreshTokenPromise = promise;
    return promise;
  };

  login = async (email: string, password: string) => {
    this.setErrors({});
    const loginParams = { email, password };
    try {
      const result = await this.rootStore.apiStore.post<LoginResponse>(
        '/auth/login/',
        loginParams,
        { noAccessToken: true },
      );
      const user = transformLoginResult(result.data);
      this.setAccessToken(user.token);
      this.setRefreshToken(user.refreshToken);
      this.setUserID(user.id);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          this.setErrors((error.response.data as LoginErrorResponse).errors);
        }
      }
    }
  };

  @action.bound
  setUserID(id: number | null) {
    if (id === null) {
      window.localStorage.removeItem('user_id');
      this.userID = null;
    } else {
      window.localStorage.setItem('user_id', id.toString());
      this.userID = id;
    }
  }

  @action.bound
  setRefreshToken(refresh_token: string | null) {
    if (!refresh_token) {
      window.localStorage.removeItem('refresh_token');
      this.refreshToken = null;
      return;
    }

    window.localStorage.setItem('refresh_token', refresh_token);
    this.refreshToken = refresh_token;
  }

  @action.bound
  setTrackerApiAccessToken(tracker_api_access_token: string | null) {
    if (!tracker_api_access_token) {
      window.localStorage.removeItem('tracker_api_access_token');
      this.trackerApiAccessToken = null;
      return;
    }

    window.localStorage.setItem('tracker_api_access_token', tracker_api_access_token);
  }

  @action.bound
  setAccessToken(token: string | null) {
    if (!token) {
      window.localStorage.removeItem('access_token');
      this.accessToken = null;
      return;
    }
    window.localStorage.setItem('access_token', token);
    this.accessToken = token;
  }

  @action.bound
  setErrors(errors: Errors) {
    this.errors = errors;
  }

  @action.bound
  logout() {
    this.setAccessToken(null);
    this.setRefreshToken(null);
    this.setTrackerApiAccessToken(null);
    this.setUserID(null);
  }
}
