import { autorun, makeObservable, observable } from 'mobx';

import type { RootStore } from '../RootStore';
import { FilterMultiSelect } from './Filters/FilterMultiSelect';
import { FilterRange } from './Filters/FilterRange';
import { FilterSelect } from './Filters/FilterSelect';
import { FilterText } from './Filters/FilterText';

export class FilterStore {
  constructor(private readonly rootStore: RootStore) {
    makeObservable(this);

    autorun(() => {
      if (this.filters.event_id.selectedValue?.key === '_empty') {
        this.filters.team_id.setSelectedGroupKey(null);
      } else {
        this.filters.team_id.setSelectedGroupKey(this.filters.event_id.selectedValue?.key ?? null);
      }
    });
    autorun(() => {
      const { osOptions } = this.rootStore.helperDataStore;
      this.filters.OS.setValues(
        osOptions.map(item => ({ key: item.code, value: item.name, icon: item.code })),
      );
    });
    autorun(() => {
      const { sportOptions } = this.rootStore.helperDataStore;

      this.filters.sport.setValues(
        sportOptions.map(item => ({ key: String(item.id), value: item.name })),
      );
    });
    autorun(() => {
      const { trackerOptions } = this.rootStore.helperDataStore;

      this.filters.tracker.setValues(
        trackerOptions.map(item => ({ key: item.code, value: item.name, icon: item.icon })),
      );
    });
    autorun(() => {
      const { extraOptions } = this.rootStore.helperDataStore;

      this.filters.extra.setValues(
        extraOptions.map(item => ({
          key: String(item.code),
          icon: item.code,
          value: item.name,
        })),
      );
    });
  }

  @observable filters = {
    event_id: new FilterSelect('Турнир', [], 'Все турниры', undefined, {
      key: '_empty',
      value: 'Все турниры',
    }),
    search: new FilterText('Имя и фамилия', 'Поиск'),
    name: new FilterText('Имя и фамилия', 'Введите имя'),
    priority: new FilterMultiSelect('Приоритет', [
      { key: '1', value: 'Высокий' },
      { key: '2', value: 'Средний' },
      { key: '3', value: 'Низкий' },
    ]),
    score: new FilterRange('Баллы'),
    distance: new FilterRange('Дистанция'),
    stood_distance: new FilterRange('Зачетная дистанция'),
    time: new FilterRange('Время'),
    pause: new FilterRange('Пауза'),
    pace: new FilterRange('Темп'),
    max_pace: new FilterRange('Максимальный темп'),
    pace_event: new FilterRange('Средний темп за турнир'),
    date: new FilterRange('Дата начала'),
    heartrate: new FilterRange('Средний пульс'),
    elevation: new FilterRange('Набор высоты'),
    sport: new FilterMultiSelect('Спорт', []),
    tracker: new FilterMultiSelect('Трекер', []),
    OS: new FilterMultiSelect('OS', []),
    team_id: new FilterMultiSelect('Команда', []),
    event_memberships: new FilterRange('Количество участий в турнире'),
    extra: new FilterMultiSelect('Дополнительные опциии', []),
  };

  resetFilters() {
    Object.entries(this.filters)
      .filter(([key]) => key !== 'event_id')
      .forEach(([, value]) => value.resetValue());
  }

  constructDataQuery = () => {
    return Object.entries(this.filters)
      .map(([k, f]) => f.constructDataObject(k))
      .filter(item => !!item)
      .reduce<Record<string, number | string | string[] | undefined>>(
        (acc, item) => ({ ...acc, ...item }),
        {},
      );
  };
}
