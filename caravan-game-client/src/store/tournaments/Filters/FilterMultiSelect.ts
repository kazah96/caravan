import { action, computed, makeObservable, observable } from 'mobx';

export type Option = {
  key: string;
  value: string;
  icon?: string;
  groupKey?: string;
};

export type Group = Record<string, { groupName: string }>;

export class FilterMultiSelect {
  constructor(
    public name: string,
    values: Option[],
  ) {
    makeObservable(this);
    this._values = values;
  }

  public static filterName = 'MultiSelectFilter';

  public static readonly defaultValue = {};

  @observable selectedValues: Record<string, boolean> = FilterMultiSelect.defaultValue;

  @observable _values: Option[] = [];

  @observable groups: Group | null = null;

  @observable selectedGroupKey: string | null = null;

  @computed
  get values() {
    const groupedValues: Record<string, Option[]> = {};
    const plainValues: Option[] = [];

    this._values.forEach(value => {
      const { groupKey } = value;

      if (groupKey) {
        if (Array.isArray(groupedValues[groupKey])) {
          groupedValues[groupKey].push(value);
        } else {
          groupedValues[groupKey] = [value];
        }
        return;
      }
      plainValues.push(value);
    });

    return { groupedValues, plainValues };
  }

  @computed
  get plainValues() {
    return this._values;
  }

  @computed
  get groupedValues() {
    if (!this.groups) {
      return null;
    }

    const groupedValues: Record<string, Option[]> = {};

    this._values.forEach(value => {
      const { groupKey } = value;

      if (groupKey) {
        if (Array.isArray(groupedValues[groupKey])) {
          groupedValues[groupKey].push(value);
        } else {
          groupedValues[groupKey] = [value];
        }
      }
    });
    return groupedValues;
  }

  @action.bound
  setSelectedGroupKey(key: string | null) {
    this.selectedGroupKey = key;
  }

  @action.bound
  setSelectedValue(key: string) {
    this.selectedValues[key] = !this.selectedValues[key];
  }

  @action.bound
  setGroups(value: Group) {
    this.groups = value;
  }

  @action.bound
  setValues(value: Option[]) {
    this._values = value;
  }

  @action.bound
  resetValue() {
    this.selectedValues = FilterMultiSelect.defaultValue;
  }

  constructQuery = (key: string) => {
    const values: string[] = [];

    Object.keys(this.selectedValues).forEach(ww => {
      if (this.selectedValues[ww]) {
        values.push(`${key}=${ww}`);
      }
    });

    return values.join('&');
  };

  constructDataObject = (key: string) => {
    return {
      [key]: Object.keys(this.selectedValues).filter(value => this.selectedValues[value]),
    };
  };
}
