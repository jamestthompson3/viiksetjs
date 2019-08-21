import * as React from 'react';
import get from 'lodash/get';

import { extractX } from '@viiksetjs/utils';
import { determineYScale, InheritedChartProps } from '@viiksetjs/utils';
import { getControlPoints, Point } from './common/utils';
import { GenericData, RenderedChildPassedProps } from '../typedef';
import { ChildContext } from './ChartArea';

//TODO
// Gradients
// Fit in bounds
// line is blurry
// Doesn't render immediately
// Unify render logic?

const LineChart: React.FunctionComponent<Props> = (
  { color, dataKey, axisId, bezier } // areaProps,
) =>
  // gradientOpacity,
  // lineProps,
  {
    if (!dataKey) throw new Error('LineChart: no data key given');
    const {
      data,
      inheritedScale,
      type,
      height,
      margin,
      canvas,
      xPoints,
      xScale,
      xKey,
    } = React.useContext(ChildContext);
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
    const xPointGetter = (d: GenericData, i: number) => {
      if (xKey) {
        return type === 'time' ? xScale(xPoints[i]) : xScale(extractX(d)[0]);
      }
    };
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.save();
      let controlPoints: Point[] = [];
      ctx.translate(margin.left, height);
      ctx.scale(1, -1);
      const axis = getAxis();
      const len = data.length;
      if (bezier) {
        for (let i = 0; i < len - 4; i += 2) {
          controlPoints = controlPoints.concat(
            getControlPoints(
              { x: xPointGetter(data[i], i), y: axis(yData[i]) },
              { x: xPointGetter(data[i + 1], i + 1), y: axis(yData[i + 1]) },
              { x: xPointGetter(data[i + 2], i + 2), y: axis(yData[i + 2]) },
              1 / 5
            )
          );
        }
        // draw all curves except first and last
        ctx.beginPath();
        for (let i = 2; i < len - 5; i += 2) {
          const cp1 = controlPoints[i - 2];
          const cp2 = controlPoints[i - 1];
          const x = xPointGetter(data[i + 2], i + 2);
          const y = axis(yData[i + 2]);
          ctx.moveTo(xPointGetter(data[i], i), axis(yData[i]));
          ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, x, y);
        }
        ctx.stroke();
        ctx.closePath();
        // Draw first and last curve
        ctx.beginPath();
        ctx.moveTo(xPointGetter(data[0], 0), axis(yData[0]));
        ctx.quadraticCurveTo(
          controlPoints[0].x,
          controlPoints[0].y,
          xPointGetter(data[2], 2),
          axis(yData[2])
        );
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(xPointGetter(data[len - 2], len - 2), axis(yData[len - 2]));
        ctx.quadraticCurveTo(
          controlPoints[len - 10].x,
          controlPoints[len - 10].y,
          xPointGetter(data[len - 4], len - 4),
          axis(yData[len - 4])
        );
        ctx.stroke();
        ctx.closePath();
      } else {
        ctx.beginPath();
        for (let i = 0; i < data.length; ++i) {
          const coords = {
            x: xPointGetter(data[i], i),
            y: axis(yData[i]),
          };
          if (i === 0) {
            ctx.moveTo(coords.x, coords.y);
          } else {
            ctx.lineTo(coords.x, coords.y);
          }
        }
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }
    return null;
  };

LineChart.defaultProps = {
  color: 'rgb(0, 157, 253)',
  nofill: false,
  nopattern: false,
};

interface LineChartProps extends RenderedChildPassedProps {
  areaProps: Object;
  lineProps: Object;
  gradientOpacity: number[];
  nofill: boolean;
  canvas: HTMLCanvasElement;
  nopattern: boolean;
  bezier: boolean;
}

type Props = Readonly<InheritedChartProps> & Partial<LineChartProps>;

export default React.memo(LineChart);
