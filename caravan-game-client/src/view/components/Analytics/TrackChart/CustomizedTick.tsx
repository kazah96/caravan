/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable react/jsx-props-no-spreading */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Text } from 'recharts';

// TODO: Fix props
export function CustomizedTick(props: any) {
  const {
    unit,
    tickFormatter,
    payload: { value },
  } = props;

  return value >= 0 ? (
    <Text {...props} className="recharts-cartesian-axis-tick-value">
      {`${tickFormatter ? tickFormatter(value) : value}${unit || ''}`}
    </Text>
  ) : null;
}
