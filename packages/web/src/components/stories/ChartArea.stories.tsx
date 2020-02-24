import * as React from 'react';
import { GraphContainer } from './styledComponents';

import timeSeries from './data/timeSeries.json';

import ChartArea, { ChartArea as Component } from '../ChartArea';
import LineChart from '../LineChart';
import ScatterPlot from '../ScatterPlot';

export default {
  title: 'ChartArea',
  component: Component,
};

export const Example = () => (
  <GraphContainer>
    <ChartArea
      data={timeSeries.data}
      axes={{
        x: {
          numTicks: 8,
        },
      }}
      yKey="messages"
      xKey="time"
      type="time"
      color="#2189C8"
      stroke="grey"
    >
      <LineChart dataKey="messages" nofill />
      <ScatterPlot
        dataKey="messages"
        stroke="black"
        color="#00ADEE"
        radius={3}
        borderWidth={3}
      />
    </ChartArea>
  </GraphContainer>
);
