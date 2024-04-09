import { action, makeObservable, observable, when } from 'mobx';

import { UserProfile } from '@model/profile';

import type { RootStore } from '../RootStore';

class UserStore {
  constructor(private readonly rootStore: RootStore) {
    makeObservable(this);

    when(
      () => !!this.rootStore.authStore.userID && this.rootStore.authStore.isLoggedIn,
      () => {
        if (this.rootStore.authStore.userID) {
          this.getUserProfile(this.rootStore.authStore.userID);
        }
      },
    );
  }

  @observable userProfile: UserProfile | null = null;

  getUserProfile = async (id: number) => {
    const result = await this.rootStore.apiStore.get<UserProfile>(`/profile?id=${id}`);
    this.setUserProfile(result.data);
  };

  @action.bound
  setUserProfile(userProfile: UserProfile) {
    this.userProfile = userProfile;
  }
}

export { UserStore };
