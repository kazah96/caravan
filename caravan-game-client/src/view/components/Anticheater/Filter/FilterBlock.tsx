import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { FilterBlockHeader } from './FilterBlockHeader';
import { FilterBody } from './FilterBody';

type Props = { areFiltersLoading: boolean };
const FilterBlock = observer(function FilterBlock(props: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { areFiltersLoading } = props;
  return (
    <section id="Filters" className="border-b bg-slate-100 rounded-t-lg p-4 relative">
      {areFiltersLoading && (
        <div className="skeleton absolute w-full h-full z-50 top-0 left-0 rounded-lg" />
      )}

      <FilterBlockHeader
        isDropdownOpened={showDropdown}
        onShowDropdownClick={() => setShowDropdown(!showDropdown)}
      />
      {showDropdown && <FilterBody onHideClick={() => setShowDropdown(false)} />}
    </section>
  );
});

export { FilterBlock };
