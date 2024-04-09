/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
type OptionType = {
  id: string;
  isChecked: boolean;
  value: string;
};
type Props = {
  option: OptionType;
  onChange: (id: string) => void;
};

export function Checkbox({ option, onChange }: Props) {
  const clickHandler = (e: React.SyntheticEvent, id: string) => {
    e.stopPropagation();
    onChange(id);
  };

  return (
    <div className="track__checkboxWrapper" onClick={e => clickHandler(e, option.id)}>
      <div className={`track__checkbox ${option.isChecked && 'track__checkbox-checked'}`}>
        {option.isChecked && (
          <svg>
            <use href="#track-check" />
          </svg>
        )}
      </div>
      <span key={option.id}>{option.value}</span>
    </div>
  );
}
