/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { CartesianGrid, ComposedChart, Legend, ResponsiveContainer } from 'recharts';

// TODO: fill with types
type PartialChartProps = {
  data: any;
  setRefAreaLeft: any;
  setRefAreaRight: any;
  zoomFromChart: any;
  children: any;
};

export function PartialChart(props: PartialChartProps) {
  const { data, setRefAreaLeft, setRefAreaRight, zoomFromChart, children } = props;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        height={350}
        data={data}
        onMouseDown={e => {
          if (e) {
            setRefAreaLeft(e.activeTooltipIndex);
          }
        }}
        onMouseMove={e => {
          if (e.isTooltipActive) {
            setRefAreaRight(e.activeTooltipIndex);
          }
        }}
        onMouseUp={zoomFromChart}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <Legend iconType="square" iconSize={8} />
        {children}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
