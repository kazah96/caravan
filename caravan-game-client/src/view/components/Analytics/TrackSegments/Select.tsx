/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useRef, useState } from 'react';

type OptionType = {
  id: string;
  value: string;
};

export function Select({
  options,
  onChange,
  selectedOption,
}: {
  options: OptionType[];
  onChange: (id: string) => void;
  selectedOption: OptionType;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outsideClickHandler = (event: Event) => {
      if (!selectRef.current) {
        return;
      }

      const withinBoundaries = event.composedPath().includes(selectRef.current);

      if (!withinBoundaries) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', outsideClickHandler);

    return () => {
      document.removeEventListener('click', outsideClickHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectRef.current]);

  const clickHandler = (e: React.SyntheticEvent, id: string) => {
    e.stopPropagation();
    onChange(id);
    setIsOpen(false);
  };

  return (
    <div className="track__selectWrapper" ref={selectRef}>
      <div className="track__select track__optionText" onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption.value}</span>
        <svg className={`track__selectTriangle ${isOpen && 'track__selectTriangle-open'}`}>
          <use href="#track-triangle" />
        </svg>
      </div>
      {isOpen && (
        <div className="track__optionsList">
          {options.map(option => {
            return (
              <span
                className="track__option track__optionText"
                onClick={e => clickHandler(e, option.id)}
                key={option.id}
              >
                {option.value}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
