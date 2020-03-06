import * as React from 'react';
import get from 'lodash/get';

import { determineYScale, InheritedChartProps } from '@viiksetjs/utils';
import {
  getControlPoints,
  Point,
  drawBezierCurve,
  drawLine,
  useCanvasRef,
} from '../utils/canvas';
import { GenericData, LineProps, RenderedChildPassedProps } from '../typedef';
import { ChildContext } from './common';

export const LineChart: React.FunctionComponent<Props> = ({
  color,
  dataKey,
  axisId,
  bezier,
  lineProps,
  nofill,
  gradientOpacity,
}) => {
  if (!dataKey) throw new Error('LineChart: no data key given');
  const {
    data,
    inheritedScale,
    type,
    height,
    margin,
    getCanvas,
    xPoints,
    xScale,
  } = React.useContext(ChildContext);
  const yData = data.map((item: GenericData) => get(item, dataKey));
  const canvas = useCanvasRef(getCanvas);
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
    if (ctx) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineProps.strokeWidth;
      const axis = getAxis();

      const getX = (i: number) => xScale(xPoints[i]);
      const getY = (i: number) => axis(yData[i]);
      let controlPoints: Point[] = [];
      const len = data.length;
      if (bezier) {
        for (let i = 0; i < len - 4; i += 2) {
          controlPoints = controlPoints.concat(
            getControlPoints(
              { x: getX(i), y: getY(i) },
              { x: getX(i + 1), y: getY(i + 1) },
              { x: getX(i + 2), y: getY(i + 2) },
              1 / 2
            )
          );
        }
        drawBezierCurve(len, controlPoints, ctx, getX, getY);
      } else {
        drawLine(
          len,
          ctx,
          getX,
          getY,
          lineProps,
          nofill,
          color,
          height,
          gradientOpacity
        );
      }
      ctx.restore();
    }
  }
  return null;
};

LineChart.defaultProps = {
  color: 'rgb(0, 157, 253)',
  nofill: false,
  nopattern: false,
  lineProps: {
    strokeWidth: 2,
  },
};

interface LineChartProps extends RenderedChildPassedProps {
  lineProps: LineProps;
  gradientOpacity: number[];
  nofill: boolean;
  canvas: HTMLCanvasElement;
  bezier: boolean;
}

type Props = LineChartProps & InheritedChartProps;

export default React.memo(LineChart);
