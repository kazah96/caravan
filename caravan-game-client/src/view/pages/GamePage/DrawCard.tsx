/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import cn from 'classnames';
import { CardSuit, Card, MAP_VARIANT_TO_VIEW } from '../../../model/base';

type CardProps = {
  card: Card;
  onClick: () => void;
  isSelected?: boolean;
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
    card: { suit, rank },
  } = props;

  const variantView = MAP_VARIANT_TO_VIEW[rank];

  const currentColor = colorMap[suit];
  const suitIcon = suitMap[suit];
  return (
    <div
      onClick={onClick}
      className={cn(
        'border-2 select-none cursor-pointer relative border-gray-300 bg-white rounded-xl w-48 h-72 p-2 flex justify-between hover:border-blue-500',
        currentColor,
        {
          'border-green-300 border-4': isSelected,
        },
      )}
    >
      <div className="flex flex-col justify-start items-center">
        <span className="text-3xl">{variantView}</span>
        <span className="text-xl">{suitMap[suit]}</span>
      </div>
      <div className="flex flex-col justify-between text-5xl py-4 px-1">
        <span>{suitIcon}</span>
        <span>{suitIcon}</span>
        <span className="rotate-180">{suitIcon}</span>
        <span className="rotate-180">{suitIcon}</span>
      </div>
      <div className="flex flex-col justify-center text-5xl py-4 px-1">
        <span>{suitIcon}</span>
      </div>
      <div className="flex flex-col justify-between text-5xl py-4 px-1">
        <span>{suitIcon}</span>
        <span>{suitIcon}</span>
        <span className="rotate-180">{suitIcon}</span>
        <span className="rotate-180">{suitIcon}</span>
      </div>
      <div className="flex flex-col rotate-180 justify-start items-center">
        <span className="text-3xl">{variantView}</span>
        <span className="text-xl">{suitMap[suit]}</span>
      </div>
    </div>
  );
}
