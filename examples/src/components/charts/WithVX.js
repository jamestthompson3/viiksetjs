import React, { Fragment } from 'react'

import timeSeries from '../../data/timeSeries.json'
import { GraphContainer, Snippet } from '../styledComponents'
import { ChartArea, LineChart } from 'viiksetjs'
import { Line } from '@vx/shape'

const isMobile = window.innerWidth <= 500

const ThresholdLine = ({ inheritedScale, margin, width }) => (
  <g id="notes">
    <Line
      to={{ x: margin.left, y: inheritedScale(4500) }}
      from={{ x: width - margin.right, y: inheritedScale(4500) }}
      strokeWidth={2}
      strokeDasharray={(5, 10)}
    />
    <text style={{ transform: `translate( ${margin.left + 5}px,${inheritedScale(4600)}px)` }}>
      all time max
    </text>
  </g>
)
const WithVX = () => (
  <Fragment>
    <GraphContainer>
      <ChartArea data={timeSeries.data} numXTicks={isMobile ? 2 : 4} color="lime" stroke="grey">
        <LineChart dataKey="messages" color="lime" />
        <ThresholdLine />
      </ChartArea>
    </GraphContainer>
    <Snippet>
      {`
         import { Line } from '@vx/shape'

         const ThresholdLine = ({ inheritedScale, margin, width }) => (
          <g id="notes">
            <Line
              to={{ x: margin.left, y: inheritedScale(4500) }}
              from={{ x: width - margin.right, y: inheritedScale(4500) }}
              strokeWidth={2}
              strokeDasharray={(5, 10)}
            />
          <text style={{ transform: translate( margin.left + 5px,inheritedScale(4600)px) }}>
           all time max
         </text>
     </g>
        )
          <ChartArea data={timeSeries.data} numXTicks={isMobile ? 2 : 4} color="lime" stroke="grey">
            <LineChart dataKey="messages" color="lime" />
            <ThresholdLine />
         </ChartArea>
`}
    </Snippet>
  </Fragment>
)

export default WithVX
