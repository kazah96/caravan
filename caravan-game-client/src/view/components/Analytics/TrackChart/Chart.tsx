/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import rangeSlider, { RangeSlider } from 'range-slider-input';
import 'range-slider-input/dist/style.css';
import './track-page.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Area, Line, ReferenceArea, Tooltip, XAxis, YAxis } from 'recharts';
import { AxisDomainItem } from 'recharts/types/util/types';

import { Sports } from '@model/sports';
import { debounce } from '@utils/debounce';

import { measureMap, offsetMap, paceMeasures, paceName, valuesOptions } from '../consts';
import { Boundaries, SegmentDivider } from '../model';
import { formatPaceTick, formatTick } from '../utils';
import { Checkbox } from './Checkbox';
import { CustomizedActiveDot } from './CustomizedActiveDot';
import { CustomizedTick } from './CustomizedTick';
import { CustomizedXAxisTick } from './CustomizedXAxisTick';
import { PartialChart } from './PartialChart';

type ChartDataItem = {
  id: number;
  time: string;
  distance: number;
  lat: number;
  lng: number;
  altitude: number;
  speed: number;
  pace: number;
  steps: number;
  accuracy: number;
};

type ChartProps = {
  initialData: ChartDataItem[];
  selectedBoundaries: Boundaries | null;
  setSelectedBoundaries: (val: [number, number]) => void;
  paceFormat: Sports['pace_format'];
  selectedDivider: SegmentDivider;
};

export function Chart({
  initialData,
  selectedBoundaries,
  setSelectedBoundaries,
  paceFormat,
  selectedDivider,
}: ChartProps) {
  const [left, setLeft] = useState<AxisDomainItem>('dataMin');
  const [right, setRight] = useState<AxisDomainItem>('dataMax');
  const [refAreaLeft, setRefAreaLeft] = useState<AxisDomainItem>('');
  const [refAreaRight, setRefAreaRight] = useState<AxisDomainItem>('');
  const [top, setTop] = useState<AxisDomainItem>('dataMax + 20');
  const [bottom, setBottom] = useState<AxisDomainItem>('dataMin - 5');
  const [top2, setTop2] = useState<AxisDomainItem>('dataMax+ 1');
  const [bottom2, setBottom2] = useState<AxisDomainItem>('dataMin - 5');
  const [values, setValues] = useState(valuesOptions);
  const [paceAxisTicks, setPaceAxisTicks] = useState<number[]>([]);
  const [distanceAxisTicks, setDistanceAxisTicks] = useState<number[]>([]);
  const rangeRef = useRef(null);
  const rangeInputElement = useRef<RangeSlider>();

  const getAxisYDomain = useCallback(
    (from: number, to: number, ref: 'altitude' | 'pace') => {
      const refData = initialData.slice(from, to);

      let axisBottom = refData[0][ref];
      let axisTop = refData[0][ref];

      refData.forEach(d => {
        if (d[ref] > axisTop) {
          axisTop = d[ref];
        }
        if (d[ref] < axisBottom) {
          axisBottom = d[ref];
        }
      });

      if (ref === 'pace') {
        const bottomWithOffset = axisBottom - offsetMap[ref][paceFormat].bottom;
        const topWithOffset = axisTop + offsetMap[ref][paceFormat].top;

        const interval = Math.round((topWithOffset - bottomWithOffset) / 5);
        const ticks = [];
        if (interval) {
          for (let i = Math.round(topWithOffset); i > bottomWithOffset; i -= interval) {
            ticks.push(i);
          }
        }
        return [bottomWithOffset, topWithOffset, ticks];
      }

      return [axisBottom - offsetMap[ref].bottom, axisTop + offsetMap[ref].top];
    },
    [initialData, paceFormat],
  );

  const getXAxisTicks = useCallback(
    (leftBoundary: number, rightBoundary: number) => {
      if (selectedDivider?.distance) {
        let ticks = [];

        for (
          let i = 0;
          i < initialData[rightBoundary].distance;
          i += selectedDivider.distance / 1000
        ) {
          ticks.push(i);
        }
        ticks.push(initialData[rightBoundary].distance);
        ticks = ticks.filter(t => t >= initialData[leftBoundary].distance);
        return ticks;
      }

      return [];
    },
    [selectedDivider.distance, initialData],
  );

  const zoom = useCallback<(boundary: Boundaries, isFromChart: boolean) => void>(
    ([originalLeftBoundary, originalRightBoundary], isFromChart = false) => {
      let leftBoundary = originalLeftBoundary;
      let rightBoundary = originalRightBoundary;

      if (leftBoundary === rightBoundary || !rightBoundary) {
        setRefAreaLeft('');
        setRefAreaRight('');
        return;
      }

      if (leftBoundary > rightBoundary) {
        [leftBoundary, rightBoundary] = [rightBoundary, leftBoundary];
      }

      const [altitudeBottom, altitudeTop] = getAxisYDomain(leftBoundary, rightBoundary, 'altitude');
      const [paceBottom, paceTop, paceTicks] = getAxisYDomain(leftBoundary, rightBoundary, 'pace');

      if (rangeInputElement.current) {
        rangeInputElement.current.value([leftBoundary, rightBoundary]);
      }
      if (isFromChart) {
        setSelectedBoundaries([leftBoundary, rightBoundary]);
      }

      setRefAreaLeft('');
      setRefAreaRight('');
      setLeft(initialData[leftBoundary].distance);
      setRight(initialData[rightBoundary].distance);
      setBottom(altitudeBottom as AxisDomainItem);
      setTop(altitudeTop as AxisDomainItem);
      setBottom2(paceBottom as AxisDomainItem);
      setTop2(paceTop as AxisDomainItem);
      setPaceAxisTicks(paceTicks as number[]);
      if (selectedDivider.distance) {
        setDistanceAxisTicks(getXAxisTicks(leftBoundary, rightBoundary));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialData, getXAxisTicks],
  );

  useEffect(() => {
    if (rangeRef.current) {
      rangeInputElement.current = rangeSlider(rangeRef.current, {
        min: 0,
        max: initialData.length - 1,
        value: [0, initialData.length - 1],
        onInput: debounce((value: [number, number], isUser: boolean) => {
          if (isUser) {
            zoom(value, false);
            setSelectedBoundaries(value);
          }
        }, 100),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeRef.current]);

  useEffect(() => {
    if (!selectedDivider.distance) {
      setDistanceAxisTicks([]);
    }
  }, [selectedDivider]);

  useEffect(() => {
    if (selectedBoundaries) {
      zoom(selectedBoundaries, false);
    } else {
      zoom([0, initialData.length - 1], false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBoundaries, selectedDivider]);

  const visibleValues = useMemo(() => values.filter(val => val.isChecked), [values]);

  return (
    <div>
      <div className={`track__chartWrapper ${!visibleValues[0] ? 'track__chartWrapper_gap' : ''}`}>
        <PartialChart
          data={initialData}
          setRefAreaLeft={setRefAreaLeft}
          setRefAreaRight={(index: number) => {
            if (refAreaLeft) {
              setRefAreaRight(String(index));
            }
          }}
          zoomFromChart={() => zoom([Number(refAreaLeft), Number(refAreaRight)], true)}
          // @ts-ignore fsd
          paceFormat={paceFormat}
        >
          <XAxis
            dataKey="distance"
            domain={[left, right]}
            type="number"
            allowDataOverflow
            tick={
              <CustomizedXAxisTick
                x={0}
                y={0}
                payload={{
                  value: 0,
                }}
              />
            }
            tickCount={10}
            ticks={distanceAxisTicks.length ? distanceAxisTicks : undefined}
          />
          <YAxis
            yAxisId="paceID"
            allowDataOverflow
            domain={[bottom2, top2]}
            type="number"
            unit={paceFormat === paceMeasures.MPKM ? '/км' : measureMap[paceFormat]}
            tickFormatter={paceFormat === paceMeasures.MPKM ? formatPaceTick : formatTick}
            reversed={paceFormat === paceMeasures.MPKM}
            width={70}
            ticks={paceAxisTicks}
            tick={
              <CustomizedTick
                unit={paceFormat === paceMeasures.MPKM ? '/км' : measureMap[paceFormat]}
              />
            }
          />
          <Line
            name={paceName[paceFormat].upper}
            yAxisId="paceID"
            dot={false}
            type="monotone"
            dataKey="pace"
            stroke="#2ca4db"
            isAnimationActive={false}
            activeDot={
              <CustomizedActiveDot
                paceFormat={paceFormat}
                unit={paceFormat === paceMeasures.MPKM ? '/км' : measureMap[paceFormat]}
                cx={undefined}
                cy={undefined}
                r={undefined}
                fill={undefined}
                payload={undefined}
                dataKey={undefined}
              />
            }
          />
          {visibleValues.length && (
            <YAxis
              width={60}
              yAxisId={visibleValues[0].id || ''}
              allowDataOverflow
              domain={visibleValues[0].id ? [bottom, top] : undefined}
              orientation="right"
              type="number"
              unit={visibleValues[0].unit || ''}
              tickFormatter={formatTick}
            />
          )}
          {!!visibleValues.length &&
            visibleValues.map(val => (
              <Area
                type="monotone"
                fillOpacity={0.5}
                fill="#bbbbbb"
                name={val.value}
                yAxisId={visibleValues.length === 1 ? val.id : undefined}
                key={val.id}
                dot={false}
                dataKey={val.id}
                stroke={val.color}
                isAnimationActive={false}
                activeDot={
                  <CustomizedActiveDot
                    unit={val.unit || ''}
                    cx={undefined}
                    cy={undefined}
                    r={undefined}
                    fill={undefined}
                    payload={undefined}
                    dataKey={undefined}
                    paceFormat={undefined}
                  />
                }
              />
            ))}
          <Tooltip
            viewBox={{ x: -1, y: -1, width: 100, height: 100 }}
            isAnimationActive={false}
            position={{ y: -100, x: -5000 }}
          />
          {refAreaLeft && refAreaRight && (
            <ReferenceArea
              yAxisId="paceID"
              x1={initialData[Number(refAreaLeft)].distance}
              x2={initialData[Number(refAreaRight)].distance}
              strokeOpacity={0.3}
            />
          )}
        </PartialChart>
      </div>
      <div ref={rangeRef} className="track__rangeInput" />
      <div className="track__chartFooter">
        <div className="track__chartFooter-row">
          <p className="track__chartFooter-title">Параметры:</p>
          <div className="track__chartFooter-value">
            {values.map(val => (
              <Checkbox
                key={val.id}
                onChange={id => {
                  const newValues = [...values];
                  const changed = newValues.find(ww => ww.id === id);
                  if (changed) {
                    changed.isChecked = !changed.isChecked;
                    setValues(newValues);
                  }
                }}
                option={val}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
