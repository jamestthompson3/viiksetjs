import * as React from 'react';
import { scaleLinear } from 'd3-scale';
import get from 'lodash/get';
import { curveBasis } from '@vx/curve';
import { extractX } from '@viiksetjs/utils';

import { StyledThreshold } from './styledComponents';
import { GenericData, RenderedChildPassedProps } from '../typedef';
import { InheritedChartProps } from '@viiksetjs/utils';

const Threshold: React.FunctionComponent<Props> = ({
  data,
  y0,
  y1,
  xScale,
  xKey,
  height,
  clipAboveTo,
  clipBelowTo,
  margin,
  inheritedScale,
  axisId,
  aboveAreaProps,
  belowAreaProps,
  lineProps,
}) => {
  if (!y0 || !y1) throw new Error('Threshold: no y0 or y1 keys given');
  // FIXME!!! Shouldn't be mapping through the data twice...
  const dataPoints = [
    ...data.map((item: GenericData) => get(item, y0)),
    ...data.map((item: GenericData) => get(item, y1)),
  ];
  React.useEffect(() => {
    // eslint-disable-next-line
    if (process.env.NODE_ENV !== 'production') {
      if (dataPoints.includes(undefined)) {
        console.warn(`LineChart: No data found with dataKey ${y0}`);
      }
    }
  }, []);

  const xPoints = (d: GenericData) => (xKey ? get(d, xKey) : extractX(d)[0]);
  const yScale = scaleLinear()
    .domain([0, Math.max(...dataPoints)])
    .range([height, margin.top + margin.top]);
  const getAxis = () => (!axisId ? inheritedScale : yScale);

  return (
    <StyledThreshold
      x={xPoints}
      y0={(d: GenericData) => get(d, y0)}
      y1={(d: GenericData) => get(d, y1)}
      yScale={(d: GenericData) => getAxis()(d)}
      {...{ xScale, data, aboveAreaProps, belowAreaProps }}
      clipAboveTo={clipAboveTo || 0}
      clipBelowTo={clipBelowTo || height}
      curve={curveBasis}
      {...lineProps}
    />
  );
};

Threshold.defaultProps = {
  aboveAreaProps: {
    fill: 'green',
    fillOpacity: 0.5,
  },
  belowAreaProps: {
    fill: 'red',
    fillOpacity: 0.5,
  },
};

interface ThresholdProps extends RenderedChildPassedProps {
  y0: string;
  y1: string;
  aboveAreaProps: Object;
  belowAreaProps: Object;
  clipBelowTo: number;
  clipAboveTo: number;
  lineProps: Object;
}

type Props = Partial<ThresholdProps> & Readonly<InheritedChartProps>;

export default React.memo(Threshold);
