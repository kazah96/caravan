/* eslint-disable react/jsx-props-no-spreading */
import cn from 'classnames';

import SearchIcon from '@assets/icons/Search.svg';

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function search(props: Props) {
  const { className, style, ...rest } = props;
  return (
    <div
      className={cn(
        'border border-gray-300 bg-white rounded-md py-2 px-4 flex items-center w-full',
        className,
      )}
      style={style}
    >
      <img src={SearchIcon} alt="icon" className="w-6 h-5 me-2" />
      <input type="text" className="outline-none w-full" placeholder="Поиск" {...rest} />
    </div>
  );
}
