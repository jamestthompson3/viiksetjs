import * as React from 'react';

import categoricalSeries from './data/categoricalSeries.json';
import { GraphContainer } from './styledComponents';
import ChartArea from '../ChartArea';
import BarChart, { BarChart as Component } from '../BarChart/Bar';
import { isMobile } from './constants';

export default {
  title: 'BarChart',
  component: Component, // Memo hides the props from being visible to tsdocgen
};

export const Example = () => (
  <GraphContainer>
    <ChartArea
      data={categoricalSeries.data}
      type="ordinal"
      color="#dc7d5b"
      axes={{
        x: {
          numTicks: isMobile ? 1 : 4,
        },
        y: {
          label: 'Culinary Score',
        },
      }}
      xKey="company"
      stroke="grey"
      nogrid
    >
      <BarChart dataKey="score" color="#dc7d5b" />
    </ChartArea>
  </GraphContainer>
);
