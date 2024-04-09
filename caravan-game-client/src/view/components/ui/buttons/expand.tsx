/* eslint-disable react/jsx-props-no-spreading */
import cn from 'classnames';

import { Chevron } from '@components/ui/icons/chevron';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  chevronDirection: 'up' | 'down';
};

export function Expand(props: Props) {
  const { className, chevronDirection, style, children, ...rest } = props;
  return (
    <button
      type="button"
      className={cn('flex items-center text-gray-700 font-bold', className)}
      {...rest}
    >
      {children}
      <span className="ps-2 pt-1">
        <Chevron direction={chevronDirection} />
      </span>
    </button>
  );
}
