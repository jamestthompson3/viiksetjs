import * as React from 'react';
import { withKnobs, select } from '@storybook/addon-knobs';

import ChartArea from '../ChartArea';
import StackedBar from '../BarChart/StackedBar';

import stackedData from './data/stackedData.json';
import { GraphContainer } from './styledComponents';
import { isMobile } from './constants';

export default {
  title: 'StackedBar',
  decorators: [withKnobs],
};

export const Example = () => {
  const orientation = select(
    'Orientation',
    ['horizontal', 'ordinal'],
    'horizontal'
  );
  const isHorizontal = orientation === 'horizontal';
  return (
    <GraphContainer>
      <ChartArea
        data={stackedData.data}
        type={isHorizontal ? 'linear' : 'ordinal'}
        orientation={orientation}
        axes={{
          x: {
            numTicks: isMobile ? 1 : 4,
          },
          y: {
            tickLabelProps: () => ({
              dx: isHorizontal ? '0em' : '-3em',
              fontSize: 10,
              strokeWidth: '0.5px',
              textAnchor: isHorizontal ? 'end' : 'middle',
            }),
          },
        }}
        color="grey"
        xKey="activity"
        stroke="grey"
        nogrid
        yKey={isHorizontal && 'activity'}
      >
        <StackedBar
          colors={['#51344D', '#6F5060', '#A78682']}
          keys={['often', 'sometimes', 'never']}
        />
      </ChartArea>
    </GraphContainer>
  );
};
