import React from 'react'
import {
  Biaxial,
  CategoricalSeries,
  StackedBarExample,
  Scatterplot,
  StackedLine,
  StreamingChart,
  TimeSeries,
  WithVX,
  ThresholdExample,
  PieExample
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
    case 'stackedbar':
      return <StackedBarExample />
    case 'interop':
      return <WithVX />
    case 'pie':
      return <PieExample />
    case 'threshold':
      return <ThresholdExample />
    default:
      return null
  }
}

export default ChartRenderer
