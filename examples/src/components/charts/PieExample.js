import React, { Fragment } from 'react'
import { PieChart } from 'viiksetjs'

import { GraphContainer, Snippet } from '../styledComponents'
import categoricalSeries from '../../data/categoricalSeries.json'

const PieExample = () => (
  <Fragment>
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
  </Fragment>
)
export default PieExample
