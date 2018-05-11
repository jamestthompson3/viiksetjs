import React, { Component } from 'react'
import { scaleLinear } from 'd3-scale'
import { curveBasis } from '@vx/curve'
import PropTypes from 'prop-types'

import { StyledThreshold } from '../styledComponents'
import { parseObject, checkMoment } from '../../utils/dataUtils'

class Threshold extends Component {
  shouldComponentUpdate(prevProps) {
    return this.props.yPoints !== prevProps.yPoints || prevProps.dataKey !== this.props.dataKey
  }

  render() {
    const {
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
    } = this.props
    // Check if data exists
    if (data.map(item => item[y0]).includes(undefined)) {
      // eslint-disable-next-line
      console.error(
        `Threshold: No data found with dataKey ${y0}. Expecting to find value using y0 prop`
      )
      return null
    }
    if (axisId && data.map(item => item[y0]).includes(undefined)) {
      // eslint-disable-next-line
      console.error(`Threshold: No data found with axisId ${axisId}`)
      return null
    }
    const xPoints = d => (xKey ? d[xKey] : new Date(parseObject(d, 'string', checkMoment)))
    const dataPoints = [...data.map(item => item[y0]), ...data.map(item => item[y1])]
    const yScale = scaleLinear()
      .domain([0, Math.max(...dataPoints)])
      .range([height, margin.top + margin.top])
    const getAxis = () => (axisId == null ? inheritedScale : yScale)

    return (
      <StyledThreshold
        x={xPoints}
        y0={d => d[y0]}
        y1={d => d[y1]}
        yScale={d => getAxis()(d)}
        {...{ xScale, data, aboveAreaProps, belowAreaProps }}
        clipAboveTo={clipAboveTo || 0}
        clipBelowTo={clipBelowTo || height}
        curve={curveBasis}
        {...lineProps}
      />
    )
  }
}

Threshold.propTypes = {
  /**
   * Specifies first threshold category
   */
  y0: PropTypes.string.isRequired,
  /**
   * Specifies second threshold category
   */
  y1: PropTypes.string.isRequired,
  /**
   * Specifies props to area above threshold
   */
  aboveAreaProps: PropTypes.object,
  /**
   * Specifies props to area below threshold
   */
  belowAreaProps: PropTypes.object,
  /**
   * Specifies the clip below
   */
  clipBelowTo: PropTypes.number,
  /**
   * species the clip above
   */
  clipAboveTo: PropTypes.number
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
export default Threshold
