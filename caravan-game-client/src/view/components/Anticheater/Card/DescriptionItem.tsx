import { ReactNode } from 'react';

export function DescriptionItem(props: { label: string; children: ReactNode }) {
  const { label, children } = props;

  return (
    <li className="mt-1 first:mt-0">
      <span className="text-gray-800">{label}:</span>
      <span className="font-bold ms-2 text-gray-800">{children}</span>
    </li>
  );
}
