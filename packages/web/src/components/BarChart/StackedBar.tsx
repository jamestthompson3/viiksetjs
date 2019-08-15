import * as React from 'react';
import { Group } from '@vx/group';
import { stack } from 'd3-shape';
import { scaleOrdinal, scaleBand, scaleLinear, scaleTime } from 'd3-scale';
import get from 'lodash/get';
import flatten from 'lodash/flatten';
import head from 'lodash/head';
import sum from 'lodash/sum';
import set from 'lodash/set';
import {
  extractLabels,
  extractX,
  Margin,
  ScaleFunction,
} from '@viiksetjs/utils';

import { StyledBar } from '../styledComponents';
import { BarChartProps, GenericData, Scales, ScaleType } from 'typedef';

function calcScales({
  data,
  keys,
  type,
  orientation,
  xPoints,
  yPoints,
  margin,
  height,
  width,
}: DataCalculationArgs): Scales {
  const dataDomain = Math.max(
    ...flatten(
      data
        .map((d: GenericData) => keys.map((key: string) => get(d, key)))
        .map((arr: number[]) => sum(arr))
    )
  );

  const scalar = type === 'linear' ? scaleLinear : scaleTime;

  if (orientation === 'horizontal') {
    const xScale = scalar() as ScaleFunction<number, number>;
    xScale.domain([0, dataDomain]).range([margin.left, width]);
    const yScale = scaleBand()
      .domain(yPoints)
      .range([height, margin.top])
      .padding(0.1);
    return { xScale, yScale };
  } else {
    const xScale = scaleBand()
      .domain(xPoints)
      .range([margin.left, width])
      .padding(0.1);
    const yScale = scalar() as ScaleFunction<number, number>;
    yScale.domain([dataDomain, 0]).range([height, margin.top]);
    return { xScale, yScale };
  }
}

const StackedBar: React.FunctionComponent<Props> = ({
  data,
  type,
  orientation,
  colors,
  keys,
  yKey,
  xKey,
  height,
  margin,
  noTool,
  mouseMove,
  declareBar,
  yPoints,
  xPoints,
  width,
  mouseLeave,
  barProps,
}) => {
  React.useEffect(() => {
    declareBar();
  }, []);
  const scales = calcScales({
    data,
    keys,
    type,
    xPoints,
    yPoints,
    margin,
    height,
    width,
    orientation,
  });

  const determineBarWidth = ({ d, isHorizontal, xScale, yScale }: BarWidth) => {
    if (isHorizontal) {
      return xScale(d[1]) - xScale(d[0]);
    } else {
      return yScale(d[1]) - yScale(d[0]);
    }
  };

  if (!keys) {
    // eslint-disable-next-line
    console.warn(
      'StackedBar: You have not provided the keys prop, this could explain unexpected render output'
    );
  }

  const zScale = scaleOrdinal()
    .domain(keys || extractLabels(data[0]))
    .range(colors);
  const { xScale, yScale } = scales;
  const isHorizontal = orientation === 'horizontal';
  const series = stack().keys(
    (keys as string[]) || (extractLabels(data[0]) as string[])
  )(data);
  const bandwidth = isHorizontal ? yScale.bandwidth() : xScale.bandwidth();
  const yPoint = (d: GenericData) => yScale(get(d, yKey));
  const xPoint = (d: GenericData) => xScale(extractX(d, xKey));
  return (
    <Group>
      {series &&
        series.map((s, i) => (
          <Group key={`BarGroup-Outer-${i}`}>
            {s.map((d: GenericData, ii: number) => {
              const barWidth = determineBarWidth({
                d,
                isHorizontal,
                xScale,
                yScale,
              });
              return (
                <StyledBar
                  key={`bar-group-bar-${i}-${ii}-${s.key}`}
                  x={isHorizontal ? xScale(d[0]) : xPoint(get(d, 'data'))}
                  y={
                    isHorizontal
                      ? yPoint(get(d, 'data'))
                      : height + margin.top - yScale(d[1])
                  }
                  width={isHorizontal ? barWidth : bandwidth}
                  height={isHorizontal ? bandwidth : barWidth}
                  fill={zScale(s.key)}
                  onMouseMove={(event: React.SyntheticEvent) => {
                    const key = s.key;
                    const datum = set(
                      {},
                      xKey || 'xValue',
                      head(extractX(get(d, 'data'), xKey))
                    );
                    set(datum, key, get(d, `data.${key}`));
                    return noTool || mouseMove({ event, datum });
                  }}
                  onMouseLeave={() => mouseLeave()}
                  {...barProps}
                />
              );
            })}
          </Group>
        ))}
    </Group>
  );
};

interface DataCalculationArgs {
  data: GenericData[];
  keys: string[];
  type: string;
  orientation: string;
  xPoints: any[];
  yPoints: any[];
  margin: Margin;
  height: number;
  width: number;
}

interface BarWidth {
  d: GenericData;
  isHorizontal: boolean;
  xScale: ScaleType;
  yScale: ScaleType;
}

interface Props extends BarChartProps {
  data: GenericData[];
  colors: string[];
  keys: string[];
}

export default React.memo(StackedBar);
