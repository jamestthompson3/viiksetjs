import React, { Fragment, Component } from 'react'
import { LinearGradient } from '@vx/gradient'
import { Group } from '@vx/group'
import { Bar } from '@vx/shape'
import PropTypes from 'prop-types'
import { rgba } from 'polished'

class BarChart extends Component {
  shouldComponentUpdate(prevProps) {
    return (
      !(prevProps.yPoints === this.props.yPoints) || !(prevProps.dataKey === this.props.dataKey)
    )
  }
  render() {
    const {
      data,
      color,
      dataKey,
      xScale,
      xKey,
      margin,
      height,
      notool,
      yPoints,
      mouseMove,
      mouseLeave,
      fill,
      inheritedScale
    } = this.props
    if (data.map(item => item[dataKey]).includes(undefined)) {
      new ReferenceError(`BarChart: No data found with dataKey ${dataKey}`)
      return null
    }
    const xPoint = d => xScale(d[xKey])
    const barHeight = d => inheritedScale(d[dataKey])
    const yMin = Math.min(...data.map(d => barHeight((d))))
    return (
      <Fragment>
        <LinearGradient from={rgba(color, 0.35)} to={rgba(color, 0.05)} id={`gradient${xKey}`} />
        {data.map((d, i) => (
          <Group key={`bar${xPoint(d)}`}>
            <Bar
              width={xScale.bandwidth()}
              height={barHeight(d)}
              x={xPoint(d)}
              y={height - barHeight(d) - margin.bottom}
              rx={5}
              data={d}
              ry={0}
              fill={fill && `url(#gradient${xKey})`}
              stroke={color}
              strokeWidth={1}
              onMouseMove={d => event => notool || mouseMove({ event, datum: d })}
              onMouseLeave={() => event => mouseLeave()}
            />
          </Group>
        ))}
      </Fragment>
    )
  }
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
