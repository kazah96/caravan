/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import cn from 'classnames';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { CardSuit, Card, MAP_VARIANT_TO_VIEW } from '../../../model/base';

type CardProps = {
  card: Card;
  index: number;
  onClick?: () => void;
  onMouseUp?: () => void;
  isSelected?: boolean;
  highlight?: 'green' | 'red' | 'blue';
  needDrag?: boolean;
};

export function DrawCard(props: CardProps) {
  const {
    isSelected,
    index,
    highlight,
    needDrag,
    card: { suit, rank },
  } = props;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    data: { index },
    disabled: !needDrag,
    id: rank + suit + String(needDrag),
  });

  const suitMap: Record<CardSuit, string> = {
    CLUBS: '♣',
    DIAMONDS: '♦',
    HEARTS: '♥',
    SPADES: '♠',
  };

  const colorMap: Record<CardSuit, string> = {
    CLUBS: 'black',
    SPADES: 'black',
    DIAMONDS: 'text-red-500',
    HEARTS: 'text-red-500',
  };

  const variantView = MAP_VARIANT_TO_VIEW[rank];

  const currentColor = colorMap[suit];
  const suitIcon = suitMap[suit];

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: transform ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        currentColor,
        {
          'hover:border-blue-500 border-2': highlight === 'blue',
          'hover:border-red-500 border-2': highlight === 'red',
          'hover:border-green-500 border-2': highlight === 'green',
          '!border-green-300 border-2': isSelected,
        },
        'touch-manipulation relative select-none opacity-100 cursor-pointer card-shadow  border-transparent border-2 bg-fallout-200 rounded-md md:rounded-xl playing-card md:p-1 flex justify-between text-[10px] md:text-xl',
      )}
    >
      <div className="flex flex-col justify-start items-center">
        <span className="text-xl lg:text-xl">{variantView}</span>
        <span className="">{suitMap[suit]}</span>
      </div>
      <div className="flex flex-col justify-between lg:text-2xl py-4">
        <span>{suitIcon}</span>
        <span>{suitIcon}</span>
        <span className="rotate-180">{suitIcon}</span>
        <span className="rotate-180">{suitIcon}</span>
      </div>
      <div className="flex flex-col justify-center lg:text-2xl py-4 lg:flex">
        <span>{suitIcon}</span>
      </div>
      <div className="flex flex-col justify-between lg:text-2xl py-4">
        <span>{suitIcon}</span>
        <span>{suitIcon}</span>
        <span className="rotate-180">{suitIcon}</span>
        <span className="rotate-180">{suitIcon}</span>
      </div>
      <div className="flex flex-col rotate-180 justify-start items-center">
        <span className="text-xl lg:text-xl">{variantView}</span>
        <span className="">{suitMap[suit]}</span>
      </div>
    </div>
  );
}
