import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
import { v4 } from 'uuid';

const TEST_API_URL = '/api/';

const API_URL = TEST_API_URL;

const getAPIUrl = () => {
  return `${API_URL}`;
};

function getUserID() {
  let userID = window.localStorage.getItem('userID');

  if (!userID) {
    userID = v4().toString();
  }

  window.localStorage.setItem('userID', userID);

  return userID;
}
export class ApiStore {
  constructor() {
    const config: AxiosRequestConfig = {
      baseURL: TEST_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    this.api = axios.create(config);
  }

  readonly api: AxiosInstance;

  // eslint-disable-next-line class-methods-use-this
  public get accessToken() {
    return window.localStorage.getItem('access_token');
  }

  // eslint-disable-next-line class-methods-use-this
  public get trackerApiAccesToken() {
    return window.localStorage.getItem('tracker_api_access_token');
  }

  // eslint-disable-next-line class-methods-use-this
  private getConfig(): AxiosRequestConfig {
    return {
      baseURL: getAPIUrl(),
      headers: {
        'Content-Type': 'application/json',
        'User-Id': getUserID(),
        Authorization: `Bearer ${window.localStorage.getItem('access_token')}`,
      },
    };
  }

  public get<T>(url: string, params?: object): AxiosPromise<T> {
    const config = { params, ...this.getConfig() };
    return this.api.get(url, config);
  }

  public post<T>(url: string, data?: unknown): AxiosPromise<T> {
    return this.api.post(url, data, this.getConfig());
  }

  public patch<T>(url: string, data: unknown): AxiosPromise<T> {
    return this.api.patch(url, data, this.getConfig());
  }

  public del<T>(url: string, data?: unknown, params?: object): AxiosPromise<T> {
    return this.api.delete(url, {
      url,
      data,
      params,
      ...this.getConfig(),
    });
  }
}
