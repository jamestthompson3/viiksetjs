import * as React from 'react';
import get from 'lodash/get';

import { StyledPoint } from './styledComponents';
import { extractX, determineYScale } from '@viiksetjs/utils';
import {
  GenericGetter,
  GenericData,
  RenderedChildPassedProps,
} from '../typedef';
import { InheritedChartProps } from '@viiksetjs/utils';

const genericGetter: GenericGetter = d => d;

const getStaticOrAccessor = (prop: any, data: GenericData) => {
  if (typeof prop === 'function') {
    return prop(data);
  }
  return prop;
};

const ScatterPlot = ({
  data,
  dataKey,
  xScale,
  color = genericGetter,
  opacity = genericGetter,
  xKey,
  height,
  radius = genericGetter,
  margin,
  inheritedScale,
  axisId,
  type,
  stroke,
  pointProps,
}: Props): React.ReactElement[] | null => {
  if (!dataKey) throw new Error('ScatterPlot: no data key given');
  React.useEffect(() => {
    // eslint-disable-next-line
    if (process.env.NODE_ENV !== 'production') {
      if (dataPoints.includes(undefined)) {
        console.warn(`ScatterPlot: No data found with dataKey ${dataKey}`);
      }
    }
  }, []);

  const getAxis = () => (!axisId ? inheritedScale : yScale);
  const dataPoints = data.map((item: GenericData) => get(item, dataKey));
  const yPoints = (d: GenericData) => getAxis()(get(d, dataKey));
  const xPoints = (d: GenericData) =>
    xScale(xKey ? get(d, xKey) : extractX(d)[0]);
  const yScale = determineYScale({
    type: type || 'linear',
    yPoints: dataPoints,
    height,
    margin,
  });
  return data.map((d: GenericData, i: number) => (
    <StyledPoint
      key={`scatter-plot-${dataKey}-${i}`}
      x={xPoints(d)}
      y={yPoints(d)}
      radius={getStaticOrAccessor(radius, d)}
      stroke={stroke}
      opacity={getStaticOrAccessor(opacity, d)}
      color={getStaticOrAccessor(color, d)}
      {...pointProps}
    />
  ));
};

ScatterPlot.defaultProps = {
  color: '#000',
  stroke: '#000',
  opacity: 0.8,
  radius: 8,
  data: [],
};

type NumGetter = (arg: GenericData) => number;
type StringGetter = (arg: GenericData) => string;

interface ScatterPlotProps extends RenderedChildPassedProps {
  radius: NumGetter | GenericGetter | number;
  color: StringGetter | GenericGetter | string;
  stroke: string;
  pointProps: number;
  data: GenericData[];
  opacity: NumGetter | GenericGetter | number;
}

type Props = Readonly<InheritedChartProps> & Partial<ScatterPlotProps>;

export default ScatterPlot;
