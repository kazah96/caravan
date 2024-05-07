import { PropsWithChildren } from 'react';
import cn from 'classnames';

type Props = PropsWithChildren<{ className?: string }>;

function FalloutWindow(props: Props) {
  const { children, className } = props;

  return (
    <div
      className={cn(
        'relative min-w-80 max-w-screen-lg  min-h-[160px] border-fallout-500 fallout-menu-background border overflow-y-auto',
        className,
      )}
    >
      {children}
    </div>
  );
}

export { FalloutWindow };
