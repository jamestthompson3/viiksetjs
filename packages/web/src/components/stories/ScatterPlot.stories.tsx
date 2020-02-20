import * as React from 'react';
import { storiesOf } from '@storybook/react';

import numericSeries from './data/numericSeries.json';
import { GraphContainer, Indicator, LinearTooltip } from './styledComponents';

import ChartArea from '../ChartArea';
import ScatterPlot from '../ScatterPlot';
import { isMobile } from './constants';

storiesOf('ScatterPlot', module).add('Example', () => (
  <GraphContainer>
    <ChartArea
      data={numericSeries.data}
      axes={{
        x: {
          numTicks: isMobile ? 1 : 4,
          label: 'Observation No.',
          labelProps: { dy: -10 },
        },
        y: {
          label: 'Heat (K)',
          labelProps: { dx: 10 },
        },
      }}
      color="#42f4c2"
      stroke="grey"
      xKey="x"
      yKey="y"
      type="linear"
      tooltip={{
        renderer: LinearTooltip,
        indicator: Indicator,
      }}
    >
      <ScatterPlot
        dataKey="y"
        color="#42f4c2"
        stroke="grey"
        borderWidth={3}
        opacity={1}
      />
    </ChartArea>
  </GraphContainer>
));
