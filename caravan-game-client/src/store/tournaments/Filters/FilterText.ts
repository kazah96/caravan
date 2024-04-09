import { action, makeObservable, observable } from 'mobx';

export class FilterText {
  constructor(
    public name: string,
    public placeholder: string,
  ) {
    makeObservable(this);
  }

  public static filterName = 'TextFilter';

  public static readonly defaultValue = '';

  @observable value: string = FilterText.defaultValue;

  @action.bound
  setValue(value: string) {
    this.value = value;
  }

  @action.bound
  resetValue() {
    this.value = FilterText.defaultValue;
  }

  constructQuery = (key: string) => {
    return this.value ? `${key}=${this.value}` : '';
  };

  constructDataObject = (key: string) => {
    return {
      [key]: this.value === '' ? undefined : this.value,
    };
  };
}
