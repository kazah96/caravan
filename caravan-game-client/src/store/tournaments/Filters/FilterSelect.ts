import { action, computed, makeObservable, observable } from 'mobx';

export type SelectValue = {
  key: string;
  value: string;
};

export class FilterSelect {
  constructor(
    public name: string,
    values: SelectValue[] = [],
    public emptyValue?: string,
    public backendKey?: string,
    defaultValue?: SelectValue,
  ) {
    makeObservable(this);
    this._values = values;
    if (defaultValue) {
      this.selectedValue = defaultValue;
    }
  }

  public static filterName = 'SelectFilter';

  public static readonly defaultValue = null;

  @observable selectedValue: SelectValue | null = FilterSelect.defaultValue;

  @observable private _values: SelectValue[] = [];

  @computed
  get values(): SelectValue[] {
    const emptyValue = this.emptyValue ? [{ key: '_empty', value: this.emptyValue }] : [];
    return [...emptyValue, ...this._values];
  }

  @action.bound
  setSelectedValue(value: SelectValue): void {
    this.selectedValue = value;
  }

  @action.bound
  setValues(value: SelectValue[]) {
    this._values = value;
  }

  @action.bound
  resetValue() {
    this.selectedValue = FilterSelect.defaultValue;
  }

  constructDataObject = (key: string) => {
    let value: string | undefined;

    if (this.selectedValue && this.selectedValue.key !== '_empty') {
      value = this.selectedValue.key;
    }
    return {
      [key]: value,
    };
  };
}
