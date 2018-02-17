import React, { Fragment, Component } from 'react'
import { LinearGradient } from '@vx/gradient'
import { scaleLinear } from 'd3-scale'
import { AreaClosed, LinePath } from '@vx/shape'
import { PatternLines } from '@vx/pattern'
import { curveMonotoneX } from '@vx/curve'
import moment from 'moment'
import PropTypes from 'prop-types'
import { rgba } from 'polished'
import { flatten } from 'lodash'

class LineChart extends Component {
  shouldComponentUpdate(prevProps) {
    return !(this.props.yPoints === prevProps.yPoints)
  }
  render() {
    const {
      data,
      color,
      dataKey,
      xScale,
      fill,
      height,
      margin,
      pattern,
      inheritedScale,
      axisId,
      ...rest
    } = this.props
    // Check if data exists
    if (data.map(item => item[dataKey]).includes(undefined)) {
      new ReferenceError(`LineChart: No data found with dataKey ${dataKey}`)
      return null
    }
    if (axisId && data.map(item => item[axisId]).includes(undefined)) {
      new ReferenceError(`LineChart: No data found with axisId ${axisId}`)
      return null
    }
    const yPoints = d => d[dataKey]
    const xPoints = d =>
      flatten(
        Object.values(d).map(value => {
          if (typeof value === 'string') {
            return moment(value)
          }
        })
      ).filter(i => i != null)[0]
    const dataPoints = data.map(item => item[dataKey])
    const yScale = scaleLinear()
      .domain([0, Math.max(...dataPoints)])
      .range([height, margin.top + margin.top])
    return (
      <Fragment>
        {pattern && (
          <Fragment>
            <LinearGradient
              from={rgba(color, 0.35)}
              to={rgba(color, 0.05)}
              id={`gradient${dataKey}`}
            />
            <PatternLines
              id={`dlines${dataKey}`}
              height={6}
              width={6}
              stroke={rgba(color, 0.15)}
              strokeWidth={1}
              orientation={['diagonal']}
            />
          </Fragment>
        )}
        {axisId !== undefined ? (
          <LinePath
            data={data}
            xScale={xScale}
            yScale={yScale}
            x={xPoints}
            y={yPoints}
            curve={curveMonotoneX}
            stroke={color}
            strokeWidth={'1.5px'}
          />
        ) : (
          <LinePath
            data={data}
            xScale={xScale}
            yScale={inheritedScale}
            x={xPoints}
            y={yPoints}
            curve={curveMonotoneX}
            stroke={color}
            strokeWidth={'1.5px'}
          />
        )}
        {fill && (
          <Fragment>
            {axisId !== undefined ? (
              <Fragment>
                <AreaClosed
                  data={data}
                  xScale={xScale}
                  yScale={yScale}
                  x={xPoints}
                  y={yPoints}
                  curve={curveMonotoneX}
                  fill={fill ? `url(#gradient${dataKey})` : null}
                  stroke={color}
                  strokeWidth={1}
                />
                <AreaClosed
                  data={data}
                  xScale={xScale}
                  yScale={yScale}
                  x={xPoints}
                  y={yPoints}
                  curve={curveMonotoneX}
                  fill={fill ? `url(#dlines${dataKey})` : null}
                  stroke={color}
                  strokeWidth={1}
                />
              </Fragment>
            ) : (
              <Fragment>
                <AreaClosed
                  data={data}
                  xScale={xScale}
                  yScale={inheritedScale}
                  x={xPoints}
                  y={yPoints}
                  curve={curveMonotoneX}
                  fill={fill ? `url(#gradient${dataKey})` : null}
                  stroke={color}
                  strokeWidth={1}
                />
                <AreaClosed
                  data={data}
                  xScale={xScale}
                  yScale={inheritedScale}
                  x={xPoints}
                  y={yPoints}
                  curve={curveMonotoneX}
                  fill={fill ? `url(#dlines${dataKey})` : null}
                  stroke={color}
                  strokeWidth={1}
                />
              </Fragment>
            )}
          </Fragment>
        )}
      </Fragment>
    )
  }
}

LineChart.propTypes = {
  /**
   * Specifies which data points the chart should use to draw itself
   **/
  dataKey: PropTypes.string.isRequired,
  /**
   * Optional color prop
   **/
  color: PropTypes.string,
  /**
   * Determines whether or not there should be a fill
   **/
  fill: PropTypes.bool,
  /**
   * Determines whether or not pattern lines should be present
   */
  pattern: PropTypes.bool
}

LineChart.defaultProps = {
  color: 'rgb(0, 157, 253)',
  fill: true,
  pattern: true
}
export default LineChart
