import * as React from 'react'

import { ChartArea, Threshold, LineChart } from '../../../lib/index'
import thresholdSeries from '../../data/thresholdSeries.json'
import { GraphContainer, Snippet } from '../styledComponents'
import { isMobile } from './constants'

export const ThresholdExample = () => (
  <>
    <GraphContainer>
      <ChartArea
        data={thresholdSeries.data}
        color="black"
        stroke="rgba(109, 109, 109, 0.13)"
        notool
        axes={{
          x: {
            numTicks: isMobile ? 1 : 4
          }
        }}
      >
        <Threshold y0="usd" y1="eur" />
        <LineChart dataKey="usd" color="black" nofill />
        <LineChart dataKey="eur" color="blue" nofill lineProps={{ strokeDasharray: [9, 9] }} />
      </ChartArea>
    </GraphContainer>
    <Snippet>
      {`
            <ChartArea
                data={thresholdSeries.data}
                color="black"
                stroke="rgba(109, 109, 109, 0.13)"
                notool
                axes={{
                  x: {
                    numTicks: isMobile ? 1 : 4
                   }
                 }}
            >
                <Threshold y0="usd" y1="eur" />
                <LineChart dataKey="usd" color="black" nofill />
                <LineChart
                  dataKey="eur"
                  color="blue"
                  nofill
                  lineProps={{ strokeDasharray: [9, 9] }}
                />
            </ChartArea>
        `}
    </Snippet>
  </>
)
