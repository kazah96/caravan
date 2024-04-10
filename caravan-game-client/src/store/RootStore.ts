import { GameStore } from './GameStore';
import { LobbyStore } from './LobbyStore';
import { NotificationStore } from './NotificationStore';
import { ApiStore } from './api/ApiStore';
import { WebsocketStore } from './api/WebsocketStore';

export class RootStore {
  public notificationsStore = new NotificationStore();

  public socketStore = new WebsocketStore();

  public apiStore = new ApiStore();

  public gameStore = new GameStore(this.socketStore);

  public lobbyStore = new LobbyStore(this.socketStore);
}
