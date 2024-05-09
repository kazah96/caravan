import { action, makeObservable, observable } from 'mobx';
import { v4 } from 'uuid';

type Notification = {
  id: string;
  variant: 'primary' | 'success' | 'danger';
  title: string;
  content: string;
};

const ALIVE_TIME = 6000;

export class NotificationStore {
  constructor() {
    makeObservable(this);
    // Notification.requestPermission();
  }

  notifications = observable.array<Notification>([]);

  private timers: Record<string, NodeJS.Timeout> = {};

  @action.bound
  private setDisposeTimer(notificationID: string) {
    this.timers[notificationID] = setTimeout(() => this.dispose(notificationID), ALIVE_TIME);
  }

  @action.bound
  public dispose(notificationID: string) {
    const timeout = this.timers[notificationID];

    if (timeout) {
      clearTimeout(timeout);
      delete this.timers[notificationID];
    }

    this.removeNotification(notificationID);
  }

  @action.bound
  private removeNotification(notificationID: string) {
    const notification = this.notifications.find(n => notificationID === n.id);

    if (notification) {
      this.notifications.remove(notification);
    }
  }

  @action.bound
  addNotification(notification: Omit<Notification, 'id'>) {
    const id = v4().toString();

    this.setDisposeTimer(id);
    this.notifications.push({ ...notification, id });
  }
}
