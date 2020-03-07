import * as React from 'react';
import get from 'lodash/get';

import { determineYScale } from '@viiksetjs/utils';
import {
  GenericGetter,
  GenericData,
  RenderedChildPassedProps,
} from '../typedef';
import { ChildContext } from './common';
import { drawPoint, useCanvasRef } from '../utils/canvas';

const genericGetter: GenericGetter = d => d;
const getStaticOrAccessor = (prop: any, data: GenericData) => {
  if (typeof prop === 'function') {
    return prop(data);
  }
  return prop;
};

export const ScatterPlot: React.FunctionComponent<Props> = (
  {
    color = genericGetter,
    opacity = genericGetter,
    radius = genericGetter,
    stroke = genericGetter,
    borderWidth = genericGetter,
    dataKey,
  } //pointProps,
) => {
  if (!dataKey) throw new Error('ScatterPlot: no data key given');
  const {
    data,
    xScale,
    xPoints,
    height,
    margin,
    inheritedScale,
    axisId,
    getCanvas,
    type,
  } = React.useContext(ChildContext);
  const canvas = useCanvasRef(getCanvas);
  const yData = data.map((item: GenericData) => get(item, dataKey));
  const getAxis = () => {
    if (!axisId) {
      return inheritedScale;
    }
    return determineYScale({
      type: type || 'linear',
      yPoints: yData,
      height,
      margin,
    });
  };
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const axis = getAxis();
    const getY = (i: number) => axis(yData[i]);
    const getX = (i: number) => xScale(xPoints[i]);
    if (ctx) {
      for (let i = 0; i < data.length; i++) {
        drawPoint(
          ctx,
          getX(i),
          getY(i),
          getStaticOrAccessor(color, data[i]),
          getStaticOrAccessor(stroke, data[i]),
          getStaticOrAccessor(borderWidth, data[i]),
          getStaticOrAccessor(opacity, data[i]),
          getStaticOrAccessor(radius, data[i])
        );
      }
    }
  }
  return null;
};

ScatterPlot.defaultProps = {
  color: '#000',
  stroke: '#000',
  opacity: 0.8,
  radius: 4,
  borderWidth: 1,
};

type NumGetter = (arg: GenericData) => number;
type StringGetter = (arg: GenericData) => string;

interface ScatterPlotProps extends RenderedChildPassedProps {
  radius: NumGetter | GenericGetter | number;
  color: StringGetter | GenericGetter | string;
  stroke: StringGetter | GenericGetter | string;
  borderWidth: NumGetter | GenericGetter | number;
  pointProps: number;
  opacity: NumGetter | GenericGetter | number;
}

type Props = Partial<ScatterPlotProps>;

export default React.memo(ScatterPlot);
