import { NotificationStore } from './NotificationStore';
import { ApiStore } from './api/ApiStore';
import { AuthStore } from './auth/AuthStore';
import { AnticheaterStore } from './tournaments/AnticheaterStore';
import { HelperDataStore } from './tournaments/HelperDataStore';
import { UserStore } from './user/UserStore';

export class RootStore {
  public notificationsStore = new NotificationStore();

  public apiStore = new ApiStore();

  public authStore = new AuthStore(this);

  public helperDataStore = new HelperDataStore(this.apiStore);

  public anticheaterStore = new AnticheaterStore(this);

  public userStore = new UserStore(this);
}
