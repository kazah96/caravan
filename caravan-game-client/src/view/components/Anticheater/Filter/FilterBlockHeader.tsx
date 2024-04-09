/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { observer } from 'mobx-react-lite';

import FilterIcon from '@assets/icons/Options/Options 2.svg';
import * as ui from '@components/ui';
import { useRootStore } from '@hooks/useRootStore';

type FilterBlockHeaderProps = {
  onShowDropdownClick: () => void;
  isDropdownOpened: boolean;
};
export const FilterBlockHeader = observer(function FilterBlockHeader(
  props: FilterBlockHeaderProps,
) {
  const {
    anticheaterStore: {
      getTracks,
      filterStore: { filters },
    },
  } = useRootStore();

  const { onShowDropdownClick, isDropdownOpened } = props;

  return (
    <form
      className="md:flex gap-4 lg:max-w-[70%]"
      onSubmit={e => {
        e.preventDefault();
        getTracks();
      }}
    >
      <ui.inputs.selector
        items={filters.event_id.values}
        selectedItem={filters.event_id.selectedValue}
        handleItemClick={key => {
          filters.event_id.setSelectedValue(key);
          getTracks();
        }}
        className="flex-1"
      />

      <ui.inputs.search
        value={filters.search.value}
        onChange={e => filters.search.setValue(e.target.value)}
        placeholder={filters.search.placeholder}
        className="mt-4 md:mt-0 flex-1"
      />
      <div className="mt-4 w-full justify-center flex md:mt-0 md:max-w-fit">
        <ui.buttons.expand
          chevronDirection={isDropdownOpened ? 'up' : 'down'}
          onClick={onShowDropdownClick}
        >
          <img src={FilterIcon} alt="" />
          <span className="ps-1 pe-1 align-middle font-normal">Фильтры</span>
        </ui.buttons.expand>
      </div>
    </form>
  );
});
