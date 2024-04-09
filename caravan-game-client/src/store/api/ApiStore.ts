import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';

type Options = {
  isTrackerApi?: boolean;
  noAccessToken?: boolean;
};
// const PROD_API_URL = 'https://dev2.alivebe.com/v1/';
const TEST_API_URL = 'http://api.dev2.alivebe.com:82';

const API_URL = TEST_API_URL;

const getAPIUrl = (isTrackerApi: boolean) => {
  if (isTrackerApi) {
    return `${API_URL}/tracker-api/v1/`;
  }
  return `${API_URL}/v1/`;
};
export class ApiStore {
  constructor() {
    const config: AxiosRequestConfig = {
      baseURL: TEST_API_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
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

  private getConfig(options: Options = {}): AxiosRequestConfig {
    if (options.noAccessToken) {
      return { baseURL: getAPIUrl(!!options.isTrackerApi) };
    }
    return {
      baseURL: getAPIUrl(!!options.isTrackerApi),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${options.isTrackerApi ? this.trackerApiAccesToken : this.accessToken}`,
      },
    };
  }

  public get<T>(url: string, params?: object, options?: Options): AxiosPromise<T> {
    const config = { params, ...this.getConfig(options) };
    return this.api.get(url, config);
  }

  public post<T>(url: string, data?: unknown, options?: Options): AxiosPromise<T> {
    return this.api.post(url, data, this.getConfig(options));
  }

  public patch<T>(url: string, data: unknown, options: Options): AxiosPromise<T> {
    return this.api.patch(url, data, this.getConfig(options));
  }

  public del<T>(url: string, data?: unknown, params?: object, options?: Options): AxiosPromise<T> {
    return this.api.delete(url, {
      url,
      data,
      params,
      ...this.getConfig(options),
    });
  }
}
