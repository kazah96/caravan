import { CaravanStore } from './caravanStore/CaravanStore';
import { NotificationStore } from './NotificationStore';
import { ApiStore } from './api/ApiStore';
import { GameStore } from './GameStore';

export class RootStore {
  public notificationsStore = new NotificationStore();

  public apiStore = new ApiStore();

  public caravanStore = new CaravanStore(this.apiStore);

  public gameStore = new GameStore(this.apiStore);

  // public lobbyStore = new LobbyStore();
}
