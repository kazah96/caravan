import { action, makeObservable, observable } from 'mobx';
import { v4 } from 'uuid';
import { EventEmitter } from 'events';

const TEST_API_URL = 'localhost:8000';

const getClientID = () => {
  const clientID = window.localStorage.getItem('clientID');

  if (!clientID) {
    const t = v4().toString();
    window.localStorage.setItem('clientID', t);
    return t;
  }

  return clientID;
};

const getAPIUrl = () => {
  return `${TEST_API_URL}/${getClientID()}`;
};

type WebsocketMessage = {
  type: 'REQUEST' | 'RESPONSE' | 'EVENT' | 'ERROR';
  data: object;
  id: string;
  path_name?: string;
};

export class WebsocketStore {
  constructor() {
    makeObservable(this);
  }

  private requestPromises: Record<string, (args: unknown) => unknown> = {};

  events: EventEmitter = new EventEmitter();

  socket: WebSocket | null = null;

  @observable isConnected = false;

  init = () => {
    if (this.isConnected) {
      return;
    }

    this.socket = new WebSocket(getAPIUrl());

    this.socket.addEventListener('open', () => {
      this.setIsConnected(true);
    });

    this.socket.addEventListener('close', () => {
      this.setIsConnected(false);
      console.log('Closed connection');
    });

    this.socket.addEventListener('message', (data: MessageEvent<string>) => {
      this.handleSocketMessage(data);
    });
  };

  sendRequest = async (pathName: string, requestData: object) => {
    const id = v4().toString();
    if (this.socket?.readyState !== 1) {
      return Promise.reject(new Error());
    }
    if (this.socket?.CONNECTING) {
      return;
    }

    if (this.socket?.OPEN === 1) {
      this.socket?.send(
        JSON.stringify({
          type: 'REQUEST',
          data: requestData,
          id,
          path_name: pathName,
        }),
      );
    }
    const promise = new Promise(executor => {
      this.requestPromises[id] = executor;
    });

    return promise;
  };

  handleSocketMessage = (data: MessageEvent<string>) => {
    const message = JSON.parse(data.data) as WebsocketMessage;

    switch (message.type) {
      case 'EVENT':
        if (message.path_name) {
          this.events.emit(message.path_name, message.data);
        } else {
          throw new Error('Event without path');
        }
        break;
      case 'RESPONSE':
        if (message.id in this.requestPromises) {
          this.requestPromises[message.id](message.data);
          delete this.requestPromises[message.id];
        }
        break;
      case 'ERROR':
      default:
        break;
    }
  };

  @action.bound
  setIsConnected(flag: boolean): void {
    this.isConnected = flag;
  }
}
