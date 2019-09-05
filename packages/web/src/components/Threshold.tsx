import * as React from 'react';
import { scaleLinear } from 'd3-scale';
import get from 'lodash/get';
import { curveBasis } from '@vx/curve';

import { StyledThreshold } from './styledComponents';
import { GenericData, RenderedChildPassedProps } from '../typedef';
import { InheritedChartProps } from '@viiksetjs/utils';
import { ChildContext } from './common';

const Threshold: React.FunctionComponent<Props> = ({
  y0,
  y1,
  clipAboveTo,
  clipBelowTo,
  axisId,
  aboveAreaProps,
  belowAreaProps,
  lineProps,
}) => {
  if (!y0 || !y1) throw new Error('Threshold: no y0 or y1 keys given');
  const {
    data,
    xScale,
    xPoints,
    height,
    margin,
    inheritedScale,
  } = React.useContext(ChildContext);
  // FIXME!!! Shouldn't be mapping through the data twice...
  const dataPoints = [
    ...data.map((item: GenericData) => get(item, y0)),
    ...data.map((item: GenericData) => get(item, y1)),
  ];
  const xPointGetter = (i: number) => xPoints[i];
  const yScale = scaleLinear()
    .domain([0, Math.max(...dataPoints)])
    .range([height, margin.top + margin.top]);
  const getAxis = () => (!axisId ? inheritedScale : yScale);

  return (
    <StyledThreshold
      x={xPointGetter}
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
