import React from 'react'

import { ChartArea, LineChart } from '../../../src/index'
import biaxialSeries from '../../data/biaxialSeries.json'
import { GraphContainer, Snippet } from '../styledComponents'
import { isMobile } from './constants'

export const StackedLine = () => (
  <>
    <GraphContainer>
      <ChartArea
        data={biaxialSeries.data}
        color="rgb(238, 66, 244)"
        stroke="rgba(109, 109, 109, 0.13)"
        axes={{
          x: {
            numXTicks: isMobile ? 1 : 4
          }
        }}
      >
        <LineChart color="rgb(238, 66, 244)" dataKey="users" />
        <LineChart color="rgb(244, 196, 65)" dataKey="posts" />
      </ChartArea>
    </GraphContainer>
    <Snippet>
      {`
         <ChartArea
          data={biaxialSeries.data}
          color="rgb(238, 66, 244)"
          stroke="rgba(109, 109, 109, 0.13)"
          axes={{
            x: {
              numXTicks: isMobile ? 1 : 4
              }
            }}
          >
          <LineChart color="rgb(238, 66, 244)" dataKey="users" />
          <LineChart color="rgb(244, 196, 65)" dataKey="posts" />
        </ChartArea>
        `}
    </Snippet>
  </>
)
