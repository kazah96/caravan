/* eslint-disable @typescript-eslint/unbound-method */
import { observer } from 'mobx-react-lite';

import * as ui from '@components/ui';
import { useRootStore } from '@hooks/useRootStore';

import ClearOutlinedIcon from '@assets/icons/Clear/Outline.svg?react';

import { FilterGroup } from './FilterItems/FilterGroup';
import { MaskedRangeFilter } from './FilterItems/MaskedRangeFilter';
import { MultiSelectBase } from './FilterItems/MultiselectFilter';
import { NumericRangeFilter } from './FilterItems/NumericRangeFilter';

type FilterBodyProps = {
  onHideClick: () => void;
};

const FilterBody = observer(function FilterBody(props: FilterBodyProps) {
  const { anticheaterStore } = useRootStore();
  const { onHideClick } = props;
  const { filterStore } = anticheaterStore;

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-2 gap-x-4 gap-y-6 mt-4 lg:grid-cols-3 xl:grid-cols-5 items-end"
    >
      <FilterGroup key="priority" label={filterStore.filters.priority.name}>
        <MultiSelectBase
          key="priority"
          selectedItems={filterStore.filters.priority.selectedValues}
          handleResetFilter={filterStore.filters.priority.resetValue}
          handleItemClick={val => filterStore.filters.priority.setSelectedValue(val)}
          items={filterStore.filters.priority.plainValues}
          groupedItems={filterStore.filters.priority.groupedValues}
          groups={filterStore.filters.priority.groups}
          selectedGroup={filterStore.filters.priority.selectedGroupKey}
        />
      </FilterGroup>
      <FilterGroup key="score" label={filterStore.filters.score.name}>
        <NumericRangeFilter
          onChange={val => filterStore.filters.score.setValue(val)}
          value={filterStore.filters.score.value}
        />
      </FilterGroup>
      <FilterGroup key="distance" label={filterStore.filters.distance.name}>
        <NumericRangeFilter
          onChange={val => filterStore.filters.distance.setValue(val)}
          value={filterStore.filters.distance.value}
        />
      </FilterGroup>
      <FilterGroup key="stood_distance" label={filterStore.filters.stood_distance.name}>
        <NumericRangeFilter
          onChange={val => filterStore.filters.stood_distance.setValue(val)}
          value={filterStore.filters.stood_distance.value}
        />
      </FilterGroup>
      <FilterGroup key="time" label={filterStore.filters.time.name}>
        <MaskedRangeFilter
          mask="##:##:##"
          onChange={val => filterStore.filters.time.setValue(val)}
          value={filterStore.filters.time.value}
        />
      </FilterGroup>
      <FilterGroup key="pause" label={filterStore.filters.pause.name}>
        <MaskedRangeFilter
          mask="##:##:##"
          onChange={val => filterStore.filters.pause.setValue(val)}
          value={filterStore.filters.pause.value}
        />
      </FilterGroup>
      <FilterGroup key="pace" label={filterStore.filters.pace.name}>
        <MaskedRangeFilter
          mask="##:##"
          onChange={val => filterStore.filters.pace.setValue(val)}
          value={filterStore.filters.pace.value}
        />
      </FilterGroup>
      <FilterGroup key="date" label={filterStore.filters.date.name}>
        <MaskedRangeFilter
          mask="##.##.####"
          onChange={val => filterStore.filters.date.setValue(val)}
          value={filterStore.filters.date.value}
        />
      </FilterGroup>
      <FilterGroup key="max_pace" label={filterStore.filters.max_pace.name}>
        <MaskedRangeFilter
          mask="##:##"
          onChange={val => filterStore.filters.max_pace.setValue(val)}
          value={filterStore.filters.max_pace.value}
        />
      </FilterGroup>
      <FilterGroup key="pace_event" label={filterStore.filters.pace_event.name}>
        <MaskedRangeFilter
          mask="##:##"
          onChange={val => filterStore.filters.pace_event.setValue(val)}
          value={filterStore.filters.pace_event.value}
        />
      </FilterGroup>
      <FilterGroup key="heartrate" label={filterStore.filters.heartrate.name}>
        <NumericRangeFilter
          onChange={val => filterStore.filters.heartrate.setValue(val)}
          value={filterStore.filters.heartrate.value}
        />
      </FilterGroup>
      <FilterGroup key="elevation" label={filterStore.filters.elevation.name}>
        <NumericRangeFilter
          onChange={val => filterStore.filters.elevation.setValue(val)}
          value={filterStore.filters.elevation.value}
        />
      </FilterGroup>
      <FilterGroup key="sport" label={filterStore.filters.sport.name}>
        <MultiSelectBase
          key="sport"
          selectedItems={filterStore.filters.sport.selectedValues}
          handleResetFilter={filterStore.filters.sport.resetValue}
          handleItemClick={val => filterStore.filters.sport.setSelectedValue(val)}
          items={filterStore.filters.sport.plainValues}
          groupedItems={filterStore.filters.sport.groupedValues}
          groups={filterStore.filters.sport.groups}
          selectedGroup={filterStore.filters.sport.selectedGroupKey}
        />
      </FilterGroup>
      <FilterGroup key="tracker" label={filterStore.filters.tracker.name}>
        <MultiSelectBase
          key="tracker"
          selectedItems={filterStore.filters.tracker.selectedValues}
          handleResetFilter={filterStore.filters.tracker.resetValue}
          handleItemClick={val => filterStore.filters.tracker.setSelectedValue(val)}
          items={filterStore.filters.tracker.plainValues}
          groupedItems={filterStore.filters.tracker.groupedValues}
          groups={filterStore.filters.tracker.groups}
          selectedGroup={filterStore.filters.tracker.selectedGroupKey}
          iconPack="trackers"
        />
      </FilterGroup>
      <FilterGroup key="os" label={filterStore.filters.OS.name}>
        <MultiSelectBase
          key="OS"
          selectedItems={filterStore.filters.OS.selectedValues}
          handleResetFilter={filterStore.filters.OS.resetValue}
          handleItemClick={val => filterStore.filters.OS.setSelectedValue(val)}
          items={filterStore.filters.OS.plainValues}
          groupedItems={filterStore.filters.OS.groupedValues}
          groups={filterStore.filters.OS.groups}
          selectedGroup={filterStore.filters.OS.selectedGroupKey}
          iconPack="os"
        />
      </FilterGroup>
      <FilterGroup key="team" label={filterStore.filters.team_id.name}>
        <MultiSelectBase
          key="team_id"
          selectedItems={filterStore.filters.team_id.selectedValues}
          handleResetFilter={filterStore.filters.team_id.resetValue}
          handleItemClick={val => filterStore.filters.team_id.setSelectedValue(val)}
          items={filterStore.filters.team_id.plainValues}
          groupedItems={filterStore.filters.team_id.groupedValues}
          groups={filterStore.filters.team_id.groups}
          selectedGroup={filterStore.filters.team_id.selectedGroupKey}
        />
      </FilterGroup>
      <FilterGroup key="extra_options" label={filterStore.filters.extra.name}>
        <MultiSelectBase
          key="extra_options"
          selectedItems={filterStore.filters.extra.selectedValues}
          handleResetFilter={filterStore.filters.extra.resetValue}
          handleItemClick={val => filterStore.filters.extra.setSelectedValue(val)}
          items={filterStore.filters.extra.plainValues}
          groupedItems={filterStore.filters.extra.groupedValues}
          groups={filterStore.filters.extra.groups}
          selectedGroup={filterStore.filters.extra.selectedGroupKey}
          iconPack="extra"
        />
      </FilterGroup>
      <FilterGroup key="event_memberships" label={filterStore.filters.event_memberships.name}>
        <NumericRangeFilter
          onChange={val => filterStore.filters.event_memberships.setValue(val)}
          value={filterStore.filters.event_memberships.value}
        />
      </FilterGroup>
      <ui.buttons.filled
        onClick={handleResetFilters}
        className="bg-gray-300 col-span-2 lg:col-span-1 xl:col-start-3"
      >
        <ClearOutlinedIcon className="me-1" /> Очистить фильтры
      </ui.buttons.filled>
      <ui.buttons.filled
        type="submit"
        className="!bg-amber-300 col-span-2 lg:col-span-1 xl:col-start-4"
      >
        Применить фильтры
      </ui.buttons.filled>
      <ui.buttons.expand
        chevronDirection="up"
        onClick={onHideClick}
        className="col-span-2 py-2 justify-center lg:col-span-1 xl:col-start-5"
      >
        Скрыть
      </ui.buttons.expand>
    </form>
  );

  function onSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    anticheaterStore.getTracks();
  }

  function handleResetFilters() {
    filterStore.resetFilters();
  }
});

export { FilterBody };
