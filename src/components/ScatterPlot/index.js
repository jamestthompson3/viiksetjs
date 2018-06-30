import React, { Fragment, Component } from 'react'
import { scaleLinear } from 'd3-scale'
import moment from 'moment'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import flatten from 'lodash/flatten'

import { StyledPoint } from '../styledComponents'

class ScatterPlot extends Component {
  shouldComponentUpdate(prevProps) {
    return this.props.yPoints !== prevProps.yPoints || prevProps.dataKey !== this.props.dataKey
  }

  render() {
    const {
      data,
      color,
      dataKey,
      xScale,
      xKey,
      opacity,
      radius,
      height,
      margin,
      inheritedScale,
      axisId,
      ...rest
    } = this.props

    // Check if data exists
    if (data.map(item => get(item, dataKey)).includes(undefined)) {
      // eslint-disable-next-line
      new console.error(`LineChart: No data found with dataKey ${dataKey}`)
      return null
    }

    if (axisId && data.map(item => get(item, axisId)).includes(undefined)) {
      // eslint-disable-next-line
      new console.error(`LineChart: No data found with axisId ${axisId}`)
      return null
    }

    const getAxis = () => (!axisId ? inheritedScale : yScale)
    const dataPoints = data.map(item => get(item, dataKey))
    const yPoints = d => getAxis()(get(d, dataKey))
    const xPoints = d =>
      xScale(
        xKey
          ? get(d, xKey)
          : flatten(
              Object.values(d).map(value => {
                if (typeof value === 'string') {
                  return moment(value)
                }
              })
              // eslint-disable-next-line
            ).filter(i => i != null)[0]
      )
    const yScale = scaleLinear()
      .domain([0, Math.max(...dataPoints)])
      .range([height, margin.top + margin.top])
    return (
      <Fragment>
        {data.map((d, i) => (
          <StyledPoint
            key={i}
            x={xPoints(d)}
            y={yPoints(d)}
            radius={radius}
            opacity={opacity}
            color={color}
            {...rest}
          />
        ))}
      </Fragment>
    )
  }
}

ScatterPlot.propTypes = {
  /**
   * Specifies which data points the chart should use to draw itself
   */
  dataKey: PropTypes.string.isRequired,
  /**
   * Specifies the radius of Scatterplot dots
   */
  radius: PropTypes.number,
  /**
   * Optional color prop
   **/
  color: PropTypes.string,
  /**
   * Opacity for points on scatterplot
   **/
  opacity: PropTypes.number
}

ScatterPlot.defaultProps = {
  color: 'rgb(0, 157, 253)',
  opacity: 0.8,
  radius: 8
}

export default ScatterPlot
