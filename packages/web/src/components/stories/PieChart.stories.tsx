import * as React from 'react';
import { storiesOf } from '@storybook/react';

import PieChart from '../PieChart';

import { GraphContainer } from './styledComponents';
import categoricalSeries from './data/categoricalSeries.json';

storiesOf('PieChart', module).add('Pie Example', () => (
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
));
