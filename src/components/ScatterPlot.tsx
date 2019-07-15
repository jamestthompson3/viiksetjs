import * as React from 'react'
import get from 'lodash/get'

import { StyledPoint } from './styledComponents'
import { extractX } from '../utils/dataUtils'
import { determineYScale } from '../utils/chartUtils'
import { RenderedChildProps } from '../types/index'

const genericGetter = d => d

const getStaticOrAccessor = (prop, data) => {
  if (typeof prop === 'function') {
    return prop(data)
  }
  return prop
}

function ScatterPlot<T>({
  data,
  dataKey,
  xScale,
  color = genericGetter,
  opacity = genericGetter,
  xKey,
  height,
  radius = genericGetter,
  margin,
  inheritedScale,
  axisId,
  type,
  stroke,
  pointProps
}: Props<T>) {
  // Check if data exists
  if (data.map((item: T) => get(item, dataKey)).includes(undefined)) {
    // eslint-disable-next-line
    process.env.NODE_ENV !== 'production' &&
      console.warn(`ScatterPlot: No data found with dataKey ${dataKey}`)
    return null
  }

  if (axisId && data.map((item: T) => get(item, axisId)).includes(undefined)) {
    // eslint-disable-next-line
    process.env.NODE_ENV !== 'production' &&
      console.warn(`ScatterPlot: No data found with axisId ${axisId}`)
    return null
  }

  const getAxis = () => (!axisId ? inheritedScale : yScale)
  const dataPoints = data.map((item: T) => get(item, dataKey))
  const yPoints = (d: T) => getAxis()(get(d, dataKey))
  const xPoints = (d: T) => xScale(xKey ? get(d, xKey) : extractX(d)[0])
  const yScale = determineYScale({
    type: type || 'linear',
    yPoints: dataPoints,
    height,
    margin
  })
  return data.map((d: T, i: number) => (
    <StyledPoint
      key={`scatter-plot-${dataKey}-${i}`}
      x={xPoints(d)}
      y={yPoints(d)}
      radius={getStaticOrAccessor(radius, d)}
      stroke={stroke}
      opacity={getStaticOrAccessor(opacity, d)}
      color={getStaticOrAccessor(color, d)}
      {...pointProps}
    />
  ))
}

ScatterPlot.defaultProps = {
  color: '#000',
  stroke: '#000',
  opacity: 0.8,
  radius: 8,
  data: []
}

type GenericGetter<T> = (arg: T) => T
type NumGetter<T> = (arg: T) => number
type StringGetter<T> = (arg: T) => string

interface Props<T> extends RenderedChildProps {
  radius: NumGetter<T> | GenericGetter<T>
  color: StringGetter<T> | GenericGetter<T>
  stroke: string
  pointProps: number
  data: T[]
  opacity: NumGetter<T> | GenericGetter<T>
}

export default React.memo(ScatterPlot)
