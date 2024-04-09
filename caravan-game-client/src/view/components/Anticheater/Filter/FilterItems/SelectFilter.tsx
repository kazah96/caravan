import { observer } from 'mobx-react-lite';
import React, { ReactNode } from 'react';
import { Dropdown } from 'react-bootstrap';

import WinnerIcon from '@assets/icons/Trophy.svg';
import { Chevron } from '@components/ui/icons/chevron';

import { ICON_MAP } from '../iconMap';

type CustomToggleProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: ReactNode;
  className?: string;
};

const CustomToggle = React.forwardRef<HTMLButtonElement, CustomToggleProps>((props, ref) => {
  const { children, onClick, className } = props;

  // TODO: Remove this trash
  const isActive = !className?.includes('show');
  return (
    <button
      type="button"
      ref={ref}
      onClick={e => {
        e.preventDefault();
        onClick(e);
      }}
      className="form-control justify-content-between d-flex form-control custom-control"
    >
      <span style={{ maxWidth: '100%' }} className="text-truncate text-nowrap">
        <img src={WinnerIcon} alt="icon" className="pe-2" />
        {children}
      </span>
      <span>
        <Chevron direction={isActive ? 'up' : 'down'} />
      </span>
    </button>
  );
});

const SelectFilter = observer(function MultiSelectBase(props: {
  items: { key: string; value: string; icon?: string }[];
  selectedItem: { key: string; value: string } | null;
  handleItemClick: (item: { key: string; value: string }) => void;
  iconPack?: keyof typeof ICON_MAP;
}) {
  const { items, selectedItem, handleItemClick, iconPack } = props;
  return (
    <Dropdown
      align="start"
      title="Dropdown start"
      id="dropdown-menu-align-start "
      className="custom-control w-100"
    >
      <Dropdown.Toggle as={CustomToggle} id="dropdown-button-dark-example1">
        {selectedItem ? selectedItem.value : ''}
      </Dropdown.Toggle>

      <Dropdown.Menu align="end" className="w-100" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {items.map(item => Item(item))}
      </Dropdown.Menu>
    </Dropdown>
  );

  function Item(item: { key: string; value: string; icon?: string | undefined }) {
    const { key, value, icon } = item;
    const iconUrl = iconPack && icon && ICON_MAP[iconPack][icon];
    return (
      <Dropdown.Item
        key={key}
        onClick={() => handleItemClick({ key, value })}
        className="d-flex justify-content-between"
      >
        <span>
          {iconUrl && <img alt={value} src={iconUrl} className="pe-2" />}
          {value}
        </span>
      </Dropdown.Item>
    );
  }
});

export { SelectFilter };
