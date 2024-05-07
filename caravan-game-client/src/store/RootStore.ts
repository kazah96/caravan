import { CaravanStore } from './caravanStore/CaravanStore';
import { NotificationStore } from './NotificationStore';
import { ApiStore } from './api/ApiStore';
import { GameStore } from './GameStore';
import { UserStore } from './UserStore';

export class RootStore {
  public notificationsStore = new NotificationStore();

  public apiStore = new ApiStore();

  public userStore = new UserStore(this.apiStore);

  public caravanStore = new CaravanStore(this.apiStore, this.userStore);

  public gameStore = new GameStore(this.apiStore);
}
