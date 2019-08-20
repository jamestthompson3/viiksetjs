import * as React from 'react';
import get from 'lodash/get';

import { extractX } from '@viiksetjs/utils';
import { determineYScale, InheritedChartProps } from '@viiksetjs/utils';
import { GenericData, RenderedChildPassedProps } from '../typedef';
import { ChildContext } from './ChartArea';

//TODO
// Gradients
// Fit in bounds
// line is blurry
// Doesn't render immediately
// Unify render logic?

const LineChart: React.FunctionComponent<Props> = (
  { color, dataKey, axisId } // areaProps,
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
      ctx.lineWidth = 0.5;
      ctx.save();
      ctx.translate(-margin.left, height);
      ctx.scale(1, -1);
      ctx.beginPath();
      const axis = getAxis();
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
}

type Props = Readonly<InheritedChartProps> & Partial<LineChartProps>;

export default React.memo(LineChart);
