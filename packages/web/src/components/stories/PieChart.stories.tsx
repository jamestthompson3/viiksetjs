import * as React from 'react';

import PieChart from '../PieChart';

import { GraphContainer } from './styledComponents';
import categoricalSeries from './data/categoricalSeries.json';

export default {
  title: 'PieChart',
};

export const Example = () => (
  <GraphContainer>
    <PieChart
      dataKey="score"
      determineOpacity={({ score }: { score: number }) => score / 5}
      data={categoricalSeries.data}
      color="#5042f4"
      labelKey="company"
      innerRadius={80}
    />
  </GraphContainer>
);
