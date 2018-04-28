import React, { Fragment } from 'react'
import moment from 'moment'

import timeSeries from '../../data/timeSeries.json'
import { GraphContainer, Snippet } from '../styledComponents'
import { ChartArea, LineChart } from 'viiksetjs'

const isMobile = window.innerWidth <= 500

const tooltipContent = ({ tooltipData }) => (
  <Fragment>
    <p>
      number of messages: <span style={{ color: '#00adee' }}>{tooltipData.messages}</span>
    </p>
    <p>
      time: <span style={{ color: '#00adee' }}>{moment(tooltipData.time).format('DD MMM YY')}</span>
    </p>
  </Fragment>
)

const TimeSeries = () => {
  return (
    <Fragment>
      <GraphContainer>
        <ChartArea
          data={timeSeries.data}
          numXTicks={isMobile ? 2 : 4}
          color="#2189C8"
          stroke="grey"
          tooltipContent={tooltipContent}
        >
          <LineChart dataKey="messages" color="#2189C8" />
        </ChartArea>
      </GraphContainer>
      <Snippet>
        {`
        const tooltipContent = ({ tooltipData }) => (
            <Fragment>
                <p>
                number of messages: <span style={{ color: '#00adee' }}>{tooltipData.messages}</span>
                </p>
                <p>
                time: <span style={{ color: '#00adee' }}>{moment(tooltipData.time).format('DD MMM YY')}</span>
                </p>
            </Fragment>
            )

          <ChartArea
            data={timeSeries.data}
            numXTicks={isMobile ? 2 : 4}
            color="#2189C8"
            stroke="grey"
            tooltipContent={tooltipContent}
        >
          <LineChart dataKey="messages" color="#2189C8" />
        </ChartArea>`}
      </Snippet>
    </Fragment>
  )
}

export default TimeSeries
