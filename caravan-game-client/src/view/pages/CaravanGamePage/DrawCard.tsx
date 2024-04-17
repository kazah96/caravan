/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import cn from 'classnames';
import { CardSuit, Card, MAP_VARIANT_TO_VIEW } from '../../../model/base';

type CardProps = {
  card: Card;
  onClick: () => void;
  isSelected?: boolean;
  highlight?: 'green' | 'red' | 'blue';
};

export function DrawCard(props: CardProps) {
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

  const {
    onClick,
    isSelected,
    highlight,
    card: { suit, rank },
  } = props;

  const variantView = MAP_VARIANT_TO_VIEW[rank];

  const currentColor = colorMap[suit];
  const suitIcon = suitMap[suit];
  return (
    <div
      onClick={onClick}
      className={cn(
        currentColor,
        {
          'hover:border-blue-500 border-2': highlight === 'blue',
          'hover:border-red-500 border-2': highlight === 'red',
          'hover:border-green-500 border-2': highlight === 'green',
          '!border-green-300 border-2': isSelected,
        },
        'transition hover:scale-125 select-none opacity-100 cursor-pointer relative card-shadow  border-transparent border-2 bg-fallout-200 rounded-md md:rounded-xl playing-card md:p-1 flex justify-between text-[10px] md:text-xl',
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
