import React from 'react'
import {
  Biaxial,
  CategoricalSeries,
  Scatterplot,
  StackedLine,
  StreamingChart,
  TimeSeries
} from './charts'
const ChartRenderer = ({ active }) => {
  switch (active) {
    case 'time':
      return <TimeSeries />
    case 'categorical':
      return <CategoricalSeries />
    case 'scatter':
      return <Scatterplot />
    case 'stackedline':
      return <StackedLine />
    case 'streaming':
      return <StreamingChart />
    case 'biaxial':
      return <Biaxial />
    default:
      return null
  }
}

export default ChartRenderer
