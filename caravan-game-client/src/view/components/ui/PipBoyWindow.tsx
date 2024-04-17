/* eslint-disable react/button-has-type */
import React, { PropsWithChildren } from 'react';
import cn from 'classnames';

type Props = PropsWithChildren<{
  title?: string;
  className?: string;
  buttons?: { label: string; callback: () => void; disabled?: boolean }[];
}>;

function PipBoyWindow(props: Props) {
  const { children, title, buttons, className } = props;

  return (
    <div className={cn('relative w-full fallout-menu-background', className)}>
      <div className="flex h-6 w-full">
        <div className="border-t-fallout-500 border-l-fallout-500 border-l border-t h-full w-[20px]" />
        {title && (
          <h2 className="-top-[12px] left-[24px] text-fallout-500 scale-y-125 md:text-xl px-2 -mt-3 font-[NewLetterGotic] tracking-wide">
            {title}
          </h2>
        )}
        <div className="border-t-fallout-500 border-r-fallout-500 border-r flex-1 border-t h-full w-[40px]" />
      </div>
      <div className="md:p-4">{children}</div>

      {buttons && (
        <div className="flex h-6 w-full">
          <div className="border-b border-b-fallout-500 border-l-fallout-500 border-l  h-full w-[20px]" />
          {buttons.map(btn => (
            <React.Fragment key={btn.label}>
              <button
                className="-top-[12px] left-[24px] text-fallout-300 font-thin px-2 mt-2 font-[NewLetterGotic] hover:underline disabled:opacity-40"
                onClick={btn.callback}
                disabled={btn.disabled}
              >
                {btn.label}
              </button>
              <div className="border-b border-b-fallout-500  h-full w-[30px]" />
            </React.Fragment>
          ))}

          <div className="border-b border-b-fallout-500 border-r-fallout-500 border-r flex-1  h-full w-[40px]" />
        </div>
      )}
    </div>
  );
}

export { PipBoyWindow };
