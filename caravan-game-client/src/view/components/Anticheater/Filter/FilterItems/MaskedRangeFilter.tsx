import { observer } from 'mobx-react-lite';
import { PatternFormat } from 'react-number-format';

import { Range } from '@model/filters';

type RangeFilterProps = {
  onChange: (range: Range) => void;
  value: Range;
  mask: string;
};

export const MaskedRangeFilter = observer(function RangeFilter(props: RangeFilterProps) {
  const { onChange, value, mask } = props;

  return (
    <div className="flex">
      <PatternFormat
        format={mask}
        className="border border-gray-300 bg-white rounded-md py-2 px-4 outline-none rounded-r-none w-full"
        value={value?.from ?? ''}
        placeholder="От"
        onChange={e => onChange({ ...value, from: e.target.value })}
      />
      <PatternFormat
        format={mask}
        className="border border-gray-300 bg-white rounded-md py-2 px-4 outline-none rounded-l-none w-full"
        placeholder="До"
        value={value?.to ?? ''}
        onChange={e => onChange({ ...value, to: e.target.value })}
      />
    </div>
  );
});
