import * as React from 'react'

import categoricalSeries from '../../data/categoricalSeries.json'
import { GraphContainer, Snippet } from '../styledComponents'
import { ChartArea, BarChart } from '../../../src/index'
import { isMobile } from './constants'

export const CategoricalSeries = () => (
  <>
    <GraphContainer>
      <ChartArea
        data={categoricalSeries.data}
        type="ordinal"
        color="#dc7d5b"
        axes={{
          x: {
            numTicks: isMobile ? 1 : 4
          },
          y: {
            label: 'Culinary Score'
          }
        }}
        xKey="company"
        stroke="grey"
        nogrid
      >
        <BarChart dataKey="score" color="#dc7d5b" />
      </ChartArea>
    </GraphContainer>
    <Snippet>
      {`
    <ChartArea
      data={categoricalSeries.data}
      type="ordinal"
      color="#dc7d5b"
      axes={{
        x: {
          numTicks: isMobile ? 1 : 4
        },
        y: {
          label: 'Culinary Score'
        }
      }}
      xKey="company"
      stroke="grey"
      nogrid
    >
      <BarChart dataKey="score" color="#dc7d5b" />
    </ChartArea>
      `}
    </Snippet>
  </>
)
