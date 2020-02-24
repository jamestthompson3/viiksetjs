import * as React from 'react';

import ChartArea from '../ChartArea';
import Threshold, { Threshold as Component } from '../Threshold';
import LineChart from '../LineChart';

import thresholdSeries from './data/thresholdSeries.json';
import { GraphContainer } from './styledComponents';
import { isMobile } from './constants';

export default {
  title: 'Threshold',
  component: Component,
};

export const Example = () => (
  <GraphContainer>
    <ChartArea
      data={thresholdSeries.data}
      color="black"
      stroke="rgba(109, 109, 109, 0.13)"
      notool
      axes={{
        x: {
          numTicks: isMobile ? 1 : 4,
        },
      }}
    >
      <Threshold y0="usd" y1="eur" />
      <LineChart dataKey="usd" color="black" nofill />
      <LineChart
        dataKey="eur"
        color="blue"
        nofill
        lineProps={{ strokeDasharray: [9, 9] }}
      />
    </ChartArea>
  </GraphContainer>
);
