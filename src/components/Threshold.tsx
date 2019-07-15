import * as React from 'react'
import { scaleLinear } from 'd3-scale'
import get from 'lodash/get'
import { curveBasis } from '@vx/curve'

import { StyledThreshold } from './styledComponents'
import { extractX } from '../utils/dataUtils'
import { RenderedChildProps } from '../types'

function Threshold<T>({
  data,
  y0,
  y1,
  xScale,
  xKey,
  height,
  clipAboveTo,
  clipBelowTo,
  margin,
  inheritedScale,
  axisId,
  aboveAreaProps,
  belowAreaProps,
  lineProps
}: Props) {
  // Check if data exists
  if (data.map(item => get(item, y0)).includes(undefined)) {
    // eslint-disable-next-line
    console.error(
      `Threshold: No data found with dataKey ${y0}. Expecting to find value using y0 prop`
    )
    return null
  }

  if (axisId && data.map(item => get(item, y0)).includes(undefined)) {
    // eslint-disable-next-line
    console.error(`Threshold: No data found with axisId ${axisId}`)
    return null
  }

  const xPoints = (d: T) => (xKey ? get(d, xKey) : extractX(d)[0])
  const dataPoints = [...data.map(item => get(item, y0)), ...data.map(item => get(item, y1))]
  const yScale = scaleLinear()
    .domain([0, Math.max(...dataPoints)])
    .range([height, margin.top + margin.top])
  const getAxis = () => (!axisId ? inheritedScale : yScale)

  return (
    <StyledThreshold
      x={xPoints}
      y0={(d: T) => get(d, y0)}
      y1={(d: T) => get(d, y1)}
      yScale={(d: T) => getAxis()(d)}
      {...{ xScale, data, aboveAreaProps, belowAreaProps }}
      clipAboveTo={clipAboveTo || 0}
      clipBelowTo={clipBelowTo || height}
      curve={curveBasis}
      {...lineProps}
    />
  )
}

Threshold.defaultProps = {
  aboveAreaProps: {
    fill: 'green',
    fillOpacity: 0.5
  },
  belowAreaProps: {
    fill: 'red',
    fillOpacity: 0.5
  }
}

interface Props extends RenderedChildProps {
  y0: string;
  y1: string;
  aboveAreaProps: Object;
  belowAreaProps: Object;
  clipBelowTo: number;
  clipAboveTo: number;
  lineProps: Object;
}

export default React.memo(Threshold)
