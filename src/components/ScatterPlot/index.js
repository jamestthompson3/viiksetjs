// @flow
import * as React from 'react'
import get from 'lodash/get'

import { StyledPoint } from '../styledComponents'
import { extractX } from '../../utils/dataUtils'
import { determineYScale } from '../../utils/chartUtils'
import { type RenderedChildProps } from '../../types/index'

function ScatterPlot({
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
}): Props {
  const getColor = d => (typeof color === 'string' ? color : color(d))

  const getOpacity = d => (typeof opacity === 'number' ? opacity : opacity(d))

  const getRadius = d => (typeof radius === 'number' ? radius : radius(d))

  // Check if data exists
  if (data.map(item => get(item, dataKey)).includes(undefined)) {
    // eslint-disable-next-line
    process.env.NODE_ENV !== 'production' &&
      console.warn(`ScatterPlot: No data found with dataKey ${dataKey}`)
    return null
  }

  if (axisId && data.map(item => get(item, axisId)).includes(undefined)) {
    // eslint-disable-next-line
    process.env.NODE_ENV !== 'production' &&
      console.warn(`ScatterPlot: No data found with axisId ${axisId}`)
    return null
  }

  const getAxis = () => (!axisId ? inheritedScale : yScale)
  const dataPoints = data.map(item => get(item, dataKey))
  const yPoints = d => getAxis()(get(d, dataKey))
  const xPoints = d => xScale(xKey ? get(d, xKey) : extractX(d)[0])
  const yScale = determineYScale({
    type: type || 'linear',
    yPoints: dataPoints,
    height,
    margin
  })
  return data.map((d, i) => (
    <StyledPoint
      key={i}
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

type Props = {
  radius: number | (any => number),
  stroke: string,
  pointProps: number,
  opacity: number | (any => number),
  ...RenderedChildProps
}

export default React.memo(ScatterPlot)
