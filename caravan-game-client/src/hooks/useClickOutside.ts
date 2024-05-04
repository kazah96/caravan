import React from 'react';

export function useClickOutside(cb: () => void) {
  const refCb = React.useRef(cb);
  const r1 = React.useRef<HTMLElement | null>(null);
  const r2 = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    refCb.current = cb;
  });

  React.useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      const element1 = r1.current;
      const element2 = r2.current;

      if (
        element1 &&
        e.target &&
        !element1.contains(e.target as HTMLElement) &&
        element2 &&
        !element2.contains(e.target as HTMLElement)
      ) {
        refCb.current();
      }
    };

    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, []);

  return [r1, r2];
}
