import { PropsWithChildren } from 'react';

type Props = PropsWithChildren;

function FalloutWindow(props: Props) {
  const { children } = props;

  return (
    <div className="relative min-w-80 max-w-screen-lg h-[160px] border-fallout-500 fallout-menu-background border">
      {children}
    </div>
  );
}

export { FalloutWindow };
