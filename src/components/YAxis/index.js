import React from 'react'
import { scaleLinear } from 'd3-scale'
import { StyledLeftAxis, StyledRightAxis } from '../styledComponents'

const YAxis = ({ height, data, axisId, color, position, width, formatY, margin, label, labelProps, numYTicks}) => {
  // Check if data exists
  if (data.map(item => item[axisId]).includes(undefined)) {
    new ReferenceError(`YAxis: No data found with axisId ${axisId}`)
    return null
  }
  const dataPoints = data.map(item => item[axisId])
  const yScale = scaleLinear()
    .domain([0, Math.max(...dataPoints)])
    .range([height, margin.top])
  return position === 'left' ? (
    <StyledLeftAxis
      scale={yScale}
      left={margin.left}
      label={label}
      labelProps={labelProps}
      color={color}
      numTicks={numYTicks}
      hideTicks
      tickLabelProps={() => ({ fill: color, dx: '-2em', fontSize: 12 })}
      tickFormat={formatY}
    />
  ) : (
    <StyledRightAxis
      scale={yScale}
      left={width}
      label={label}
      labelProps={labelProps}
      color={color}
      numTicks={numYTicks}
      hideTicks
      tickLabelProps={() => ({ fill: color, fontSize: 12 })}
      tickFormat={formatY}
    />
  )
}

YAxis.defaultProps = {
  labelProps: { fontSize: 12, textAnchor: 'middle', fill: 'black', y: -20 }
}

export default YAxis
