import cn from 'classnames';
import { ReactNode, useEffect, useState } from 'react';

import ArrowLeft from '@assets/icons/Arrow/Left.svg?react';
// eslint-disable-next-line no-restricted-syntax
import { clamp } from 'remeda';

type Props = {
  pages: number;
  onPageClick: (page: number) => void;
  currentPage: number;
};
const MAX_PAGES = 7;

export function PaginationControl(props: Props) {
  const { pages, currentPage, onPageClick } = props;
  const [currentOffset, setCurrentOffset] = useState(0);

  const pagesArr = new Array(pages).fill('a').map((_, index) => index + 1);
  const lastOffset = pagesArr.length - MAX_PAGES;
  const slice = pagesArr.slice(currentOffset, currentOffset + MAX_PAGES);

  useEffect(() => {
    if (pages < MAX_PAGES) {
      setCurrentOffset(0);
      return;
    }
    if (currentPage < MAX_PAGES) {
      return;
    }
    setCurrentOffset(clamp(currentPage - Math.ceil(MAX_PAGES / 2), { min: 0, max: lastOffset }));
  }, [currentPage, pages, setCurrentOffset, lastOffset]);

  return (
    <div className="flex lg:justify-end justify-center">
      {currentOffset > 0 &&
        getButton(<ArrowLeft />, false, () => setCurrentOffset(currentOffset - 1))}
      {slice.map(value => {
        return getButton(
          value,
          currentPage === value,
          () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            onPageClick(value);
          },
          String(value),
        );
      })}
      {currentOffset < lastOffset &&
        getButton(<ArrowLeft className="rotate-180" />, false, () =>
          setCurrentOffset(currentOffset + 1),
        )}
    </div>
  );

  function getButton(content: ReactNode, isActive: boolean, onClick: () => void, key?: string) {
    return (
      <button
        type="submit"
        className={cn(
          'ms-1 border-gray-300 bg-white rounded-md border w-8 h-8 flex justify-center items-center',
          {
            '!bg-amber-300 border-0': isActive,
          },
        )}
        onClick={onClick}
        key={key}
      >
        {content}
      </button>
    );
  }
}
