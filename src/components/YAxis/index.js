import React from 'react'
import { scaleLinear } from 'd3-scale'
import { StyledLeftAxis, StyledRightAxis } from '../styledComponents'

const YAxis = ({
  height,
  data,
  axisId,
  color,
  position,
  width,
  formatY,
  margin,
  label,
  labelProps,
  numYTicks,
  tickLabels,
  ...rest
}) => {
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
      {...{ scale: yScale, label, labelProps, color }}
      left={margin.left}
      numTicks={numYTicks}
      hideTicks
      tickFormat={formatY}
      tickLabels={
        tickLabels
          ? tickLabels
          : () => ({
              dy: '-0.25rem',
              dx: '-1.75rem',
              strokeWidth: '0.5px',
              fontWeight: '400',
              textAnchor: 'left',
              fontSize: 12
            })
      }
      {...rest}
    />
  ) : (
    <StyledRightAxis
      {...{ scale: yScale, label, labelProps, color }}
      left={width}
      numTicks={numYTicks}
      hideTicks
      tickFormat={formatY}
      tickLabels={
        tickLabels
          ? tickLabels
          : () => ({
              dy: '-0.25rem',
              dx: '0rem',
              strokeWidth: '0.5px',
              fontWeight: '400',
              textAnchor: 'left',
              fontSize: 12
            })
      }
      {...rest}
    />
  )
}

YAxis.defaultProps = {
  labelProps: () => ({ fontSize: 12, textAnchor: 'middle', fill: 'black' })
}

export default YAxis
