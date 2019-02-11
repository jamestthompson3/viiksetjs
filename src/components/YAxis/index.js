import React from 'react'
import { scaleLinear } from 'd3-scale'
import get from 'lodash/get'
import { StyledLeftAxis, StyledRightAxis } from '../styledComponents'

function YAxis({
  height,
  data,
  axisId,
  color,
  position,
  width,
  margin,
  label,
  labelProps,
  axes: { y },
  tickLabels,
  ...rest
}) {
  // Check if data exists
  if (data.map(item => get(item, axisId)).includes(undefined)) {
    // eslint-disable-next-line
    console.error(`YAxis: No data found with axisId ${axisId}`)
    return null
  }

  const dataPoints = data.map(item => get(item, axisId))
  const yScale = scaleLinear()
    .domain([0, Math.max(...dataPoints)])
    .range([height, margin.top])
  return position === 'left' ? (
    <StyledLeftAxis
      {...{ scale: yScale, label, labelProps, color }}
      left={margin.left}
      numTicks={y.numTicks}
      hideTicks
      tickFormat={y.tickFormat}
      tickLabelProps={
        tickLabels
          ? tickLabels
          : () => ({
              dy: '-0.25rem',
              dx: '-0.75rem',
              strokeWidth: '0.5px',
              fontWeight: '400',
              textAnchor: 'end',
              fontSize: 12
            })
      }
      {...rest}
    />
  ) : (
    <StyledRightAxis
      {...{ scale: yScale, label, labelProps, color }}
      left={width}
      numTicks={y.numTicks}
      hideTicks
      tickFormat={y.tickFormat}
      tickLabelProps={
        tickLabels
          ? tickLabels
          : () => ({
              dy: '-0.25rem',
              dx: '0.5rem',
              strokeWidth: '0.5px',
              fontWeight: '400',
              textAnchor: 'end',
              fontSize: 12
            })
      }
      {...rest}
    />
  )
}

YAxis.defaultProps = {
  labelProps: { fontSize: 12, textAnchor: 'middle', fill: 'black' },
  data: []
}

export default React.memo(YAxis)
