import * as React from 'react'
import parse from 'date-fns/parse'
import format from 'date-fns/format'

import timeSeries from '../../data/timeSeries.json'
import { GraphContainer, Snippet } from '../styledComponents'
import { ChartArea, LineChart } from '../../../src/index'
import { isMobile } from './constants'

export const tooltipContent = ({ tooltipData }) => (
  <>
    <p>
      number of messages: <span style={{ color: '#00adee' }}>{tooltipData.messages}</span>
    </p>
    <p>
      time: <span style={{ color: '#00adee' }}>{format(parse(tooltipData.time))}</span>
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
        color="#2189C8"
        stroke="grey"
        tooltip={{
          content: tooltipContent
        }}
      >
        <LineChart dataKey="messages" color="#2189C8" />
      </ChartArea>
    </GraphContainer>
    <Snippet>
      {`
    const tooltipContent = ({ tooltipData }) => (
      <>
       <p>
          number of messages:
          <span style={{ color: '#00adee' }}>{tooltipData.messages}</span>
       </p>
       <p>
        time:
        <span style={{ color: '#00adee' }}>{format(parse(tooltipData.time))}</span>
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
      <LineChart dataKey="messages" color="#2189C8" />
    </ChartArea>`}
    </Snippet>
  </>
)
