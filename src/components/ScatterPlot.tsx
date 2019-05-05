import * as React from 'react'
import get from 'lodash/get'

import { StyledPoint } from './styledComponents'
import { extractX } from '../utils/dataUtils'
import { determineYScale } from '../utils/chartUtils'
import { RenderedChildProps } from '../types/index'

function ScatterPlot<T>({
  data,
  dataKey,
  xScale,
  color,
  opacity,
  xKey,
  height,
  radius,
  margin,
  inheritedScale,
  axisId,
  type,
  stroke,
  pointProps
}): Props<T> {
  const getColor = (d: T) => (typeof color === 'string' ? color : color(d))

  const getOpacity = (d: T) => (typeof opacity === 'number' ? opacity : opacity(d))

  const getRadius = (d: T) => (typeof radius === 'number' ? radius : radius(d))

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
      radius={getRadius(d)}
      stroke={stroke}
      opacity={getOpacity(d)}
      color={getColor(d)}
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

type NumGetter<T> = (arg: T) => number
type StringGetter<T> = (arg: T) => string

interface Props<T> extends RenderedChildProps {
  radius: NumGetter<T> | number;
  color: StringGetter<T> | string;
  stroke: string;
  pointProps: number;
  data: T[];
  opacity: NumGetter<T> | number;
}

export default React.memo(ScatterPlot)
