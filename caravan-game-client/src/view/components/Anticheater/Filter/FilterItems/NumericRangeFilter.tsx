import { observer } from 'mobx-react-lite';
import { NumericFormat } from 'react-number-format';

import { Range } from '@model/filters';

type RangeFilterProps = {
  onChange: (range: Range) => void;
  value: Range;
};

export const NumericRangeFilter = observer(function RangeFilter(props: RangeFilterProps) {
  const { onChange, value } = props;
  return (
    <div className="flex">
      <NumericFormat
        className="border border-gray-300 bg-white rounded-md py-2 px-4 outline-none rounded-r-none w-full"
        placeholder="От"
        value={value?.from ?? ''}
        onChange={e => onChange({ ...value, from: e.target.value })}
      />
      <NumericFormat
        className="border border-gray-300 bg-white rounded-md py-2 px-4 outline-none rounded-l-none w-full"
        placeholder="До"
        value={value?.to ?? ''}
        onChange={e => onChange({ ...value, to: e.target.value })}
      />
    </div>
  );
});
