import { action, makeObservable, observable } from 'mobx';

import { Range } from '@model/filters';

export class FilterRange {
  constructor(public name: string) {
    makeObservable(this);
  }

  public static filterName = 'RangeFilter';

  public static readonly defaultValue = { from: null, to: null };

  @observable value: Range = FilterRange.defaultValue;

  @action.bound
  setValue(value: Range) {
    this.value = value;
  }

  @action.bound
  resetValue() {
    this.value = FilterRange.defaultValue;
  }

  constructQuery = (key: string) => {
    const l = this.value.from ? `${key}_from=${this.value.from}` : '';
    const r = this.value.to ? `${key}_to=${this.value.to}` : '';

    return [l, r].filter(i => !!i).join('&');
  };

  constructDataObject = (key: string) => {
    return {
      [`${key}_from`]: this.value.from ?? undefined,
      [`${key}_to`]: this.value.to ?? undefined,
    };
  };
}
