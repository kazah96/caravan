import cn from 'classnames';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Filled(props: Props) {
  const { className, style, children, ...rest } = props;
  return (
    <button
      type="button"
      className={cn(
        'w-full bg-gray-100 text-gray-800 rounded-lg py-2 px-4 flex justify-center items-center cursor-pointer font-bold ',
        className,
      )}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      {children}
    </button>
  );
}
