/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-argument */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { paceMeasures } from '../consts';
import { getFormattedPace } from '../utils';

// TODO: fill with types
type Props = {
  cx: any;
  cy: any;
  r: any;
  fill: any;
  payload: any;
  dataKey: any;
  unit: any;
  paceFormat: any;
};

export function CustomizedActiveDot(props: Props) {
  const { cx, cy, r, fill, payload, dataKey, unit, paceFormat } = props;
  if (cx === +cx && cy === +cy && r === +r) {
    return (
      <g>
        {dataKey === 'pace' ? (
          <g>
            <circle cx={cx} cy={cy} r={6} fill="#fff" />
            <circle cx={cx} cy={cy} r={5} fill={fill} />
            <text x={cx + 10} y={cy} dominantBaseline="middle" fontWeight="500" fontSize="12px">
              {paceFormat === paceMeasures.MPKM
                ? getFormattedPace(payload[dataKey])
                : payload[dataKey]}
              {unit}
            </text>
            <text x={cx + 10} y={25} dominantBaseline="middle" fontWeight="500" fontSize="12px">
              {payload.duration}
            </text>
          </g>
        ) : (
          <g>
            <circle cx={cx} cy={cy} r={6} fill="#fff" />
            <circle cx={cx} cy={cy} r={5} fill={fill} />
            <text x={cx + 10} y={cy} dominantBaseline="middle" fontWeight="500" fontSize="12px">
              {payload[dataKey]} {unit}
            </text>
          </g>
        )}
      </g>
    );
  }

  return null;
}
