import * as React from 'react'
import { PieChart } from '../../../lib/index'

import { GraphContainer, Snippet } from '../styledComponents'
import categoricalSeries from '../../data/categoricalSeries.json'

export const PieExample = () => (
  <>
    <GraphContainer>
      <PieChart
        dataKey="score"
        determineOpacity={d => d.score / 5}
        data={categoricalSeries.data}
        color="#5042f4"
        labelKey="company"
        innerRadius={80}
      />
    </GraphContainer>
    <Snippet>
      {`
         <PieChart
            dataKey="score"
            determineOpacity={d => d.score / 5}
            data={categoricalSeries.data}
            color="#5042f4"
            labelKey="company"
            innerRadius={80}
           />
        `}
    </Snippet>
  </>
)
