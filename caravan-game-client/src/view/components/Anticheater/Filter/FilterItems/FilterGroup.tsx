import { ReactNode } from 'react';

type FilterGroupProps = { label: string; children: ReactNode };

function FilterGroup(props: FilterGroupProps) {
  const { label, children } = props;

  return (
    <div>
      <label htmlFor="ggg" className="block font-bold mb-2 text-gray-700">
        {label}:
      </label>
      {children}
    </div>
  );
}

export { FilterGroup };
