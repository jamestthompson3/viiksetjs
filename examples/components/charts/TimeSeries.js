import * as React from 'react'
import parse from 'date-fns/parse'
import format from 'date-fns/format'

import timeSeries from '../../data/bigdata.json'
import { GraphContainer, Snippet } from '../styledComponents'
import { ChartArea, LineChart } from '@viiksetjs/web'
import { isMobile } from './constants'

export const tooltipContent = ({ tooltipData }) => (
  <>
    <p>
      users.peak: <span style={{ color: '#00adee' }}>{tooltipData.users.peak}</span>
    </p>
    <p>
      time:{' '}
      <span style={{ color: '#00adee' }}>{format(parse(tooltipData.time), 'MMM Do HH:mm')}</span>
    </p>
  </>
)

export const TimeSeries = () => (
  <>
    <GraphContainer>
      <ChartArea
        data={timeSeries.data}
        axes={{
          x: {
            numTicks: isMobile ? 2 : 4
          }
        }}
        yKey="users.peak"
        xKey="time"
        type="time"
        color="#2189C8"
        stroke="grey"
        tooltip={{
          content: tooltipContent
        }}
      >
        <LineChart nofill nopattern dataKey="users.peak" color="#2189C8" />
      </ChartArea>
    </GraphContainer>
    <Snippet>
      {`
    const tooltipContent = ({ tooltipData }) => (
      <>
       <p>
          users.peak:
          <span style={{ color: '#00adee' }}>{tooltipData.users.peak}</span>
       </p>
       <p>
        time:
        <span style={{ color: '#00adee' }}>{format(parse(tooltipData.time), 'MMM Do HH:mm')}</span>
       </p>
     </>
      )

      <ChartArea
        data={timeSeries.data}
        axes={{
          x: {
            numTicks: isMobile ? 2 : 4
          }
        }}
        color="#2189C8"
        stroke="grey"
        tooltip={{
          content: tooltipContent
        }}
      >
      <LineChart dataKey="users.peak" color="#2189C8" />
    </ChartArea>`}
    </Snippet>
  </>
)
