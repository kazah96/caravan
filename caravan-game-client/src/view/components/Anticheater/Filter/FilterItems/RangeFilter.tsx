import { observer } from 'mobx-react-lite';

import { Range } from '@model/filters';

type RangeFilterProps = {
  onChange: (range: Range) => void;
  value: Range;
};

export const RangeFilter = observer(function RangeFilter(props: RangeFilterProps) {
  const { onChange, value } = props;

  return (
    <div className="d-flex">
      <input
        className="form-control col rounded-start"
        style={{ borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
        value={value?.from ?? ''}
        placeholder="От"
        onChange={e => onChange({ ...value, from: e.target.value })}
      />
      <input
        className="form-control col"
        placeholder="До"
        style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
        value={value?.to ?? ''}
        onChange={e => onChange({ ...value, to: e.target.value })}
      />
    </div>
  );
});
