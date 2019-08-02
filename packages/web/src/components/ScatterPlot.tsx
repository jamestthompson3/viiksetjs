import * as React from 'react';
import get from 'lodash/get';

import { StyledPoint } from './styledComponents';
import { extractX, determineYScale } from '@viiksetjs/utils';
import { RenderedChildProps, GenericGetter, GenericData } from '../typedef';

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
  // Check if data exists
  if (data.map((item: GenericData) => get(item, dataKey)).includes(undefined)) {
    // eslint-disable-next-line
    process.env.NODE_ENV !== 'production' &&
      console.warn(`ScatterPlot: No data found with dataKey ${dataKey}`);
    return null;
  }

  if (
    axisId &&
    data.map((item: GenericData) => get(item, axisId)).includes(undefined)
  ) {
    // eslint-disable-next-line
    process.env.NODE_ENV !== 'production' &&
      console.warn(`ScatterPlot: No data found with axisId ${axisId}`);
    return null;
  }

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

interface Props extends RenderedChildProps {
  radius: NumGetter | GenericGetter | number;
  color: StringGetter | GenericGetter | string;
  stroke: string;
  pointProps: number;
  data: GenericData[];
  opacity: NumGetter | GenericGetter | number;
}

export default ScatterPlot;
