import { action, makeObservable, observable } from 'mobx';

import { Sports } from '@model/sports';

import { ApiStore } from '../api/ApiStore';

type TrackerOptions = {
  code: 'string';
  name: 'string';
  icon: 'string';
};

type OSOptions = {
  code: 'string';
  name: 'string';
  icon: 'string';
};
type ExtraOptions = {
  code: string;
  name: string;
};

export class HelperDataStore {
  constructor(private readonly apiStore: ApiStore) {
    makeObservable(this);
  }

  @observable trackerOptions: TrackerOptions[] = [];

  @observable osOptions: OSOptions[] = [];

  @observable sportOptions: Sports[] = [];

  @observable extraOptions: ExtraOptions[] = [];

  @observable isSportOptionsLoaded = false;

  @observable isTrackerOptionsLoaded = false;

  @observable isExtraOptionsLoaded = false;

  @observable isOsOptionsLoaded = false;

  getSportByID = (id: string | number) => {
    return this.sportOptions.find(s => s.id === id);
  };

  requestOSOptions = async () => {
    const result = await this.apiStore.get<OSOptions[]>('/anticheater/os-options');
    this.setOSOptions(result.data);
  };

  requestSportOptions = async () => {
    const result = await this.apiStore.get<{ data: Sports[] }>('/sport/index');

    this.setSportsOptions(result.data.data);
  };

  requestTrackerOptions = async () => {
    const result = await this.apiStore.get<TrackerOptions[]>('/anticheater/tracker-options');

    this.setTrackerOptions(result.data);
  };

  requestExtraOptions = async () => {
    const result = await this.apiStore.get<ExtraOptions[]>('/anticheater/extra-options');

    this.setExtraOptions(result.data);
  };

  @action.bound
  setOSOptions = (osOptions: OSOptions[]) => {
    this.osOptions = osOptions;
    this.isOsOptionsLoaded = true;
  };

  @action.bound
  setSportsOptions = (sportsOptions: Sports[]) => {
    this.sportOptions = sportsOptions;
    this.isSportOptionsLoaded = true;
  };

  @action.bound
  setTrackerOptions = (trackerOptions: TrackerOptions[]) => {
    this.trackerOptions = trackerOptions;
    this.isTrackerOptionsLoaded = true;
  };

  @action.bound
  setExtraOptions = (extraOptions: ExtraOptions[]) => {
    this.extraOptions = extraOptions;
    this.isExtraOptionsLoaded = true;
  };
}
