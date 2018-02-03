import React from 'react'
import { scaleLinear } from 'd3-scale'
import { AxisRight, AxisLeft } from '@vx/axis'


const YAxis = ({
  height,
  data,
  axisId,
  color,
  position,
  width,
  formatter,
  margin
}) => {
  // Check if data exists
  if (data.map(item => item[axisId]).includes(undefined)) {
    new ReferenceError(`YAxis: No data found with axisId ${axisId}`)
    return null
  }
  const dataPoints = data.map(item => item[axisId])
  const yScale = scaleLinear()
    .domain([Math.min(...dataPoints), Math.max(...dataPoints)])
    .range([height, margin.top])
  return (
    position === 'left'
      ? <AxisLeft
        scale={yScale}
        left={margin.left}
        numTicks={4}
        stroke={color}
        strokeWidth={2}
        hideTicks
        tickLabelProps={(val) => ({ fill: color, dx: val >= 1000 ? '-2em' : '-1.5rem' })}
        tickFormat={formatter}
      />
      : <AxisRight
        scale={yScale}
        numTicks={4}
        left={width - margin.right}
        stroke={color}
        strokeWidth={2}
        hideTicks
        tickLabelProps={() => ({ fill: color })}
        tickFormat={formatter}
      />
  )
}

export default YAxis
