import * as React from 'react'

import { ChartArea, LineChart, YAxis } from '../../../src/index'

import biaxialSeries from '../../data/biaxialSeries.json'
import { GraphContainer, Snippet, BiaxialTooltip } from '../styledComponents'
import { isMobile } from './constants'

export const Biaxial = () => (
  <>
    <GraphContainer>
      <ChartArea
        data={biaxialSeries.data}
        color="rgb(238, 66, 244)"
        stroke="rgba(109, 109, 109, 0.25)"
        tooltip={{
          renderer: BiaxialTooltip
        }}
        axes={{
          x: {
            numTicks: isMobile ? 1 : 4
          }
        }}
        determineViewBox={({ size, margin }) =>
          `-10 0 ${size.width + margin.left + margin.right} ${size.height}`
        }
      >
        <LineChart color="rgb(238, 66, 244)" dataKey="users" axisId="users" />
        <LineChart color="rgb(244, 196, 65)" dataKey="posts" axisId="posts" />
        <YAxis
          color="rgb(244, 196, 65)"
          axisId="posts"
          position="right"
          label="posts"
          tickFormat={d => d / 1000 + 'k'}
          tickLabelProps={() => ({
            dx: 8,
            fontSize: '12px',
            textAnchor: 'middle'
          })}
          labelProps={{
            y: -20,
            dx: 10,
            textAnchor: 'start',
            fill: 'rgb(244, 196, 65)',
            fontSize: '12px'
          }}
        />
        <YAxis
          color="rgb(238, 66, 244)"
          axisId="users"
          position="left"
          label="users"
          tickFormat={d => d / 1000 + 'k'}
          labelProps={{
            y: -20,
            dx: -12,
            textAnchor: 'end',
            fill: 'rgb(238, 66, 244)',
            fontSize: '12px'
          }}
        />
      </ChartArea>
    </GraphContainer>
    <Snippet>
      {`
          <ChartArea
            data={biaxialSeries.data}
            color="rgb(238, 66, 244)"
            stroke="rgba(109, 109, 109, 0.25)"
            tooltip={{
              renderer: BiaxialTooltip
            }}
            axes={{
              x: {
                numTicks: isMobile ? 1 : 4
              }
            }}
          >
            <LineChart color="rgb(238, 66, 244)" dataKey="users" axisId="users" />
            <LineChart color="rgb(244, 196, 65)" dataKey="posts" axisId="posts" />
            <YAxis
              color="rgb(244, 196, 65)"
              axisId="posts"
              position="right"
              label="posts"
              labelProps={{ y: -20, textAnchor: 'end', fill: 'rgb(244, 196, 65)', fontSize: '12px' }}
            />
            <YAxis
              color="rgb(238, 66, 244)"
              axisId="users"
              position="left"
              label="users"
              labelProps={{ y: -20, textAnchor: 'end', fill: 'rgb(238, 66, 244)', fontSize: '12px' }}
            />
          </ChartArea>
          `}
    </Snippet>
  </>
)
