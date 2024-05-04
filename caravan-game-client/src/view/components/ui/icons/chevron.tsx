import cn from 'classnames';

import ChevronIcon from '@assets/icons/Chevron.svg?react';

type Props = {
  direction?: 'up' | 'right' | 'down' | 'left';
};

function Chevron({ direction = 'down' }: Props) {
  const classes = {
    'rotate-90': direction === 'right',
    '!-scale-150': direction === 'down',
    '-rotate-90': direction === 'left',
  };
  return (
    <ChevronIcon className={cn('scale scale-150 transition duration-300 ease-out', classes)} />
  );
}

export { Chevron };
