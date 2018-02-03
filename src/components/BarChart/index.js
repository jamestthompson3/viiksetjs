import React, { Fragment } from 'react'
import { LinearGradient } from '@vx/gradient'
import { Bar } from '@vx/shape'
import PropTypes from 'prop-types'
import { rgba } from 'polished'

const BarChart = ({
  data,
  color,
  dataKey,
  xScale,
  xKey,
  margin,
  height,
  fill,
  inheritedScale,
  ...rest
}) => {
  if (data.map(item => item[dataKey]).includes(undefined)) {
    new ReferenceError(`LineChart: No data found with dataKey ${dataKey}`)
    return null
  }
  const xPoint = d => xScale(d[xKey])
  const yMax = height - margin.bottom
  const barHeight = d => inheritedScale(d[dataKey]) - margin.top
  return (
    <Fragment>
      <LinearGradient
        from={rgba(color, 0.35)}
        to={rgba(color, 0.05)}
        id={`gradient${xKey}`}
      />
      {data.map((d, i) =>
        <Bar
          width={xScale.bandwidth()}
          key={i}
          height={barHeight(d)}
          x={xPoint(d)}
          y={yMax - barHeight(d)}
          rx={5}
          ry={0}
          fill={fill && `url(#gradient${xKey})`}
          stroke={color}
          strokeWidth={1}
        />
      )}
    </Fragment>
  )
}

BarChart.propTypes = {
  /**
   * Indicates which data column should draw the BarChart
   */
  dataKey: PropTypes.string.isRequired,
  /**
   * Indicates the color of the BarChart
   */
  color: PropTypes.string
}

BarChart.defaultProps = {
  color: 'rgb(0, 157, 253)',
  fill: true
}
export default BarChart
