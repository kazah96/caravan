/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */

/* eslint-disable react/jsx-props-no-spreading */
import cn from 'classnames';
import { useRef, useState } from 'react';

import WinnerIcon from '@assets/icons/Trophy.svg';
import { Chevron } from '@components/ui/icons/chevron';

import { Dropdown } from '../utils/dropdown';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  items: { key: string; value: string; icon?: string }[];
  selectedItem: { key: string; value: string } | null;
  handleItemClick: (item: { key: string; value: string }) => void;
};

export function Selector(props: Props) {
  const { className, items, selectedItem, handleItemClick } = props;
  const referenceElement = useRef<HTMLButtonElement | null>(null);

  const [show, setShow] = useState(false);

  return (
    <>
      <button
        type="button"
        ref={referenceElement}
        onClick={() => {
          setShow(!show);
        }}
        className={cn(
          'border border-gray-300 bg-white rounded-md py-2 px-4 flex items-center cursor-pointer w-full text-left',
          className,
        )}
      >
        <img src={WinnerIcon} alt="icon" className="w-6 me-2" />
        <span className="flex-1 truncate">{selectedItem?.value}</span>
        <Chevron direction={show ? 'up' : 'down'} />
      </button>
      {show && (
        <Dropdown
          show={show}
          onExit={() => setShow(false)}
          variant="both"
          referenceElement={referenceElement?.current}
        >
          <ul className="px-2 py-3">
            {items.map(item => (
              <li
                key={item.key}
                className="px-3 py-2 hover:bg-gray-100 hover: rounded-lg cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                {item.value}
              </li>
            ))}
          </ul>
        </Dropdown>
      )}
    </>
  );
}
