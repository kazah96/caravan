/* eslint-disable jsx-a11y/click-events-have-key-events */

/* eslint-disable jsx-a11y/no-static-element-interactions */
import { PropsWithChildren, useEffect } from 'react';

import { ScrollBarHelper } from '@utils/scrollbar';

type Props = PropsWithChildren<{
  onHide: () => void;
  show: boolean;
}>;
const helper = new ScrollBarHelper();

export function Modal(props: Props) {
  const { onHide, children, show } = props;

  useEffect(() => {
    if (show) {
      helper.hide();
    } else {
      helper.reset();
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      helper.reset();
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [show]);

  if (!show) {
    return null;
  }

  return (
    <div
      className="w-screen h-screen fixed bg-gray-100 bg-opacity-60 z-50 top-0 left-0"
      onClick={onHide}
    >
      <div className="flex justify-center items-center h-full z-[100]">
        <div
          className="flex-1 mx-4 max-w-[500px] max-h-[500px]"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
