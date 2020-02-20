import * as React from 'react';

import timeSeries from './data/timeSeries.json';
import { GraphContainer } from './styledComponents';

import ChartArea from '../ChartArea';
import LineChart from '../LineChart';
import { ChildContext } from '../common';

import { Line } from '@vx/shape';
import { isMobile } from './constants';

export default {
  title: 'Interop with VX',
};

export const WithVX = () => {
  const ThresholdLine = () => {
    const { inheritedScale, margin, width } = React.useContext(ChildContext);
    return (
      <g id="notes">
        <Line
          to={{ x: margin.left, y: inheritedScale(4500) }}
          from={{ x: width - margin.right, y: inheritedScale(4500) }}
          strokeWidth={2}
          stroke="#000"
          strokeDasharray={[5, 10]}
        />
        <text
          style={{
            transform: `translate( ${margin.left + 5}px,${inheritedScale(
              4600
            )}px)`,
          }}
        >
          all time max
        </text>
      </g>
    );
  };

  return (
    <GraphContainer>
      <ChartArea
        data={timeSeries.data}
        axes={{ x: { numTicks: isMobile ? 2 : 4 } }}
        color="lime"
        stroke="grey"
      >
        <LineChart dataKey="messages" color="lime" />
        <ThresholdLine />
      </ChartArea>
    </GraphContainer>
  );
};
