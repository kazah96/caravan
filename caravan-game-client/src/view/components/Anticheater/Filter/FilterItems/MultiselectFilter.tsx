/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { useRef, useState } from 'react';

import ClearIconFilled from '@assets/icons/Clear/Filled.svg?react';
import * as ui from '@components/ui';
import { Chevron } from '@components/ui/icons/chevron';
import { Option } from '@store/tournaments/Filters/FilterMultiSelect';

import { ICON_MAP } from '../iconMap';

type Group = Record<string, { groupName: string }>;

const MultiSelectBase = observer(function MultiSelectBase(props: {
  className?: string;
  items: { key: string; value: string; icon?: string }[];
  selectedItems: Record<string, boolean | undefined>;
  handleItemClick: (key: string) => void;
  handleResetFilter: () => void;
  groups: Group | null;
  groupedItems: Record<string, Option[]> | null;
  selectedGroup: string | null;
  iconPack?: keyof typeof ICON_MAP;
}) {
  const referenceElement = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  const {
    items,
    handleResetFilter,
    selectedGroup,
    selectedItems,
    handleItemClick,
    groupedItems,
    groups,
    iconPack,
    className,
  } = props;
  const selectedItemsList = items.filter(item => selectedItems[item.key]).map(item => item.value);
  const selectedItemsString = selectedItemsList.join(',');
  const groupsItems = groups ? Object.keys(groups) : [];

  return (
    <>
      <div
        ref={referenceElement}
        onClick={() => {
          setShow(!show);
        }}
        className={cn(
          'border border-gray-300 bg-white rounded-md py-2 px-4 flex items-center cursor-pointer w-full text-left',
          className,
        )}
      >
        <span
          className={cn('truncate max-w-full flex-1', {
            'text-gray-400': selectedItemsList.length === 0,
          })}
        >
          {selectedItemsList.length === 0 && 'Выбрать'}
          {selectedItemsString !== '' && selectedItemsString}
        </span>
        {selectedItemsList.length > 0 && (
          <button
            type="button"
            aria-label="Clear filter"
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              handleResetFilter();
            }}
            className="h-6 w-7 flex items-center justify-center"
          >
            <ClearIconFilled className="me-2" />
          </button>
        )}
        <Chevron direction={show ? 'up' : 'down'} />
      </div>
      {show && (
        <ui.utils.dropdown
          show={show}
          onExit={() => setShow(false)}
          variant="outside"
          referenceElement={referenceElement?.current}
          className="max-h-[500px] overflow-y-auto overflow-x-hidden"
        >
          <ul className="px-2 py-3">
            {groupsItems.length === 0 && items.map(item => Item(item))}
            {groupedItems &&
              groupsItems.length > 0 &&
              selectedGroup &&
              (groupedItems[selectedGroup] ?? []).map(item => Item(item))}
            {groupsItems.length > 0 &&
              !selectedGroup &&
              groupsItems.map(groupKey => {
                return (
                  <React.Fragment key={groupKey}>
                    <h5 className="bg-gray-100 p-4 font-bold">
                      {groups ? groups[groupKey].groupName : groupKey}
                    </h5>
                    {groupedItems?.[groupKey]?.map(item => Item(item))}
                  </React.Fragment>
                );
              })}
          </ul>
        </ui.utils.dropdown>
      )}
    </>
  );

  function Item(item: { key: string; value: string; icon?: string | undefined }) {
    const { key, value, icon } = item;
    const iconUrl = iconPack && icon && ICON_MAP[iconPack][icon];

    return (
      <li
        key={key}
        onClick={() => handleItemClick(key)}
        className="px-3 py-2 hover:bg-gray-100 hover: rounded-md cursor-pointer flex"
      >
        {iconUrl && <img alt={value} src={iconUrl} className="pe-2" />}
        <span className="flex-1">{value}</span>
        <input type="checkbox" checked={selectedItems[key] ?? false} readOnly />
      </li>
    );
  }
});

export { MultiSelectBase };
