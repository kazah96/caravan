/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */

/* eslint-disable react/jsx-props-no-spreading */
import cn from 'classnames';
import { PropsWithChildren, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';

import { useClickOutside } from '@hooks/useClickOutside';

type Props = PropsWithChildren<{
  show: boolean;
  onExit: () => void;
  referenceElement: HTMLElement | null;
  variant: 'inside' | 'outside' | 'both';
  className?: string;
}>;

export function Dropdown(props: Props) {
  const { show, onExit, referenceElement, children, variant, className } = props;
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
    modifiers: [{ name: 'arrow' }],
  });

  const handleClickAway = () => {
    if (show && (variant === 'outside' || variant === 'both')) {
      onExit();
    }
  };

  const [r1, r2] = useClickOutside(handleClickAway);

  useEffect(() => {
    if (referenceElement) {
      r2.current = referenceElement;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referenceElement]);

  return createPortal(
    <div
      aria-hidden={!show}
      ref={element => {
        if (element) {
          setPopperElement(element);
          r1.current = element;
        }
      }}
      onClick={() => {
        if (variant === 'inside' || variant === 'both') {
          onExit();
        }
      }}
      className={cn(
        'min-w-fit aria-hidden:invisible shadow-md mt-1 border-gray-300 bg-white rounded-md z-50',
        className,
      )}
      style={{ ...styles.popper, width: referenceElement?.clientWidth }}
      {...attributes.popper}
    >
      {children}
    </div>,
    document.getElementById('destination')!,
  );
}
