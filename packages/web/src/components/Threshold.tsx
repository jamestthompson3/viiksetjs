import * as React from 'react';
import { scaleLinear } from 'd3-scale';
import get from 'lodash/get';
import { curveBasis } from '@vx/curve';
import { extractX } from '@viiksetjs/utils';

import { StyledThreshold } from './styledComponents';
import { RenderedChildProps, GenericData } from '../typedef';

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

interface Props extends RenderedChildProps {
  y0: string;
  y1: string;
  aboveAreaProps: Object;
  belowAreaProps: Object;
  clipBelowTo: number;
  clipAboveTo: number;
  lineProps: Object;
}

export default React.memo(Threshold);
