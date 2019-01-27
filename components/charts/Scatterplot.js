import * as React from 'react'

import numericSeries from '../../data/numericSeries.json'
import { GraphContainer, Snippet, Indicator, LinearTooltip } from '../styledComponents'

import { ChartArea, ScatterPlot } from '../../../src/index'
import { isMobile } from './constants'

export const Scatterplot = () => (
  <>
    <GraphContainer>
      <ChartArea
        data={numericSeries.data}
        numXTicks={isMobile ? 1 : 4}
        color="#42f4c2"
        stroke="grey"
        xKey="x"
        yKey="y"
        type="linear"
        labelY="Heat (K)"
        labelX="Observation No."
        tooltipRenderer={LinearTooltip}
        indicator={Indicator}
      >
        <ScatterPlot dataKey="y" color="#42f4c2" />
      </ChartArea>
    </GraphContainer>
    <Snippet>
      {`
          const Indicator = ({ x, color, yCoords, height }) => (
            <Line
              from={{ x: x, y: height }}
              to={{ x: x, y: yCoords[1] + 8 }}
              stroke={color}
              strokeWidth={5}
              strokeOpacity={1.5}
              style={{ pointerEvents: 'none' }}
            />
          )
          const LinearTooltip = ({ tooltipData, x, yCoords }) => (
              <BoundedTooltip left={x} yCoord={yCoords[1] - 15}>
                {tooltipData.y < 300 ? '❄️' : '🔥'}
              </BoundedTooltip>
             )
        <ChartArea
          data={numericSeries.data}
          color="#42f4c2"
          stroke="grey"
          xKey="x"
          yKey="y"
          type="linear"
          labelY="Heat (K)"
          labelX="Observation No"
          tooltip={LinearTooltip}
          indicator={Indicator}
        >
          <ScatterPlot dataKey="y" color="#42f4c2" />
        </ChartArea>
        `}
    </Snippet>
  </>
)
