import { action, makeObservable, observable } from 'mobx';
import { v4 } from 'uuid';

const TEST_API_URL = 'ws://192.168.0.95:8000/ws';

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

export class WebsocketStore {
  constructor() {
    makeObservable(this);
    this.socket = new WebSocket(getAPIUrl());

    this.socket.addEventListener('open', () => {
      this.setIsConnected();
    });
  }

  socket: WebSocket | null = null;

  @observable isConnected = false;

  @action.bound
  setIsConnected() {
    this.isConnected = true;
  }
}
