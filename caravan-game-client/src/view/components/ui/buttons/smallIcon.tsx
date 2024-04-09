import cn from 'classnames';
import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  IconComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  isActive?: boolean;
  tooltip?: string;
  variant?: 'red' | 'green';
};

export function SmallIcon(props: Props) {
  const { setTooltipRef, setTriggerRef, getTooltipProps, visible } = usePopperTooltip({
    placement: 'top',
  });
  const { className, variant, style, IconComponent, tooltip, isActive, ...rest } = props;

  const iconClassName = variant === 'green' ? 'icon-active-green' : 'icon-active';
  return (
    <button
      type="button"
      ref={setTriggerRef}
      className={cn(
        { [iconClassName]: isActive },
        'tooltip rounded-md bg-gray-100 h-8 w-8 hover:bg-gray-200 transition-colors small-icon',
      )}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      <IconComponent className={cn('m-auto')} />
      {tooltip && visible && (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltiptext' })}>
          {tooltip}
        </div>
      )}
    </button>
  );
}
