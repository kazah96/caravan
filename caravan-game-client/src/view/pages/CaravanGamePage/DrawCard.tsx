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
        'select-none opacity-100 cursor-pointer relative card-shadow  bg-fallout-200 rounded-xl w-32 h-52 p-2 flex justify-between ',
        currentColor,
        {
          'hover:border-blue-500 border-2': highlight === 'blue',
          'hover:border-red-500 border-2': highlight === 'red',
          'hover:border-green-500 border-2': highlight === 'green',
          'border-green-300 border-2': isSelected,
        },
      )}
    >
      <div className="flex flex-col justify-start items-center">
        <span className="text-xl">{variantView}</span>
        <span className="text-xl">{suitMap[suit]}</span>
      </div>
      <div className="flex flex-col justify-between text-3xl py-4 px-1">
        <span>{suitIcon}</span>
        <span>{suitIcon}</span>
        <span className="rotate-180">{suitIcon}</span>
        <span className="rotate-180">{suitIcon}</span>
      </div>
      <div className="flex flex-col justify-center text-3xl py-4 px-1">
        <span>{suitIcon}</span>
      </div>
      <div className="flex flex-col justify-between text-3xl py-4 px-1">
        <span>{suitIcon}</span>
        <span>{suitIcon}</span>
        <span className="rotate-180">{suitIcon}</span>
        <span className="rotate-180">{suitIcon}</span>
      </div>
      <div className="flex flex-col rotate-180 justify-start items-center">
        <span className="text-xl">{variantView}</span>
        <span className="text-xl">{suitMap[suit]}</span>
      </div>
    </div>
  );
}
