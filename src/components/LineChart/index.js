import React, { Fragment, Component } from 'react'
import { scaleLinear } from 'd3-scale'
import { curveMonotoneX } from '@vx/curve'
import moment from 'moment'
import PropTypes from 'prop-types'
import { flatten } from 'lodash'

import {
  StyledGradient,
  StyledPatternLines,
  StyledLinePath,
  StyledAreaClosed
} from '../styledComponents'

class LineChart extends Component {
  shouldComponentUpdate(prevProps) {
    return (
      !(this.props.yPoints === prevProps.yPoints) || !(prevProps.dataKey === this.props.dataKey)
    )
  }
  render() {
    const {
      data,
      color,
      dataKey,
      xScale,
      xKey,
      nofill,
      height,
      margin,
      nopattern,
      inheritedScale,
      axisId
    } = this.props
    // Check if data exists
    if (data.map(item => item[dataKey]).includes(undefined)) {
      // eslint-disable-next-line
      console.error(`LineChart: No data found with dataKey ${dataKey}`)
      return null
    }
    if (axisId && data.map(item => item[axisId]).includes(undefined)) {
      // eslint-disable-next-line
      console.error(`LineChart: No data found with axisId ${axisId}`)
      return null
    }
    const yPoints = d => d[dataKey]
    const xPoints = d =>
      xKey
        ? d[xKey]
        : flatten(
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
    const getAxis = () => (axisId == null ? inheritedScale : yScale)
    const findFill = gradient => {
      if (nofill) {
        return
      }
      return gradient ? `url(#gradient${dataKey})` : `url(#dlines${dataKey})`
    }
    return (
      <Fragment>
        {!nofill && (
          <Fragment>
            <StyledGradient {...{ color }} id={`gradient${dataKey}`} />
            <StyledPatternLines {...{ color }} id={`dlines${dataKey}`} />
          </Fragment>
        )}
        <StyledLinePath
          {...{ data, color }}
          y={yPoints}
          x={xPoints}
          yScale={getAxis()}
          xScale={xScale}
          curve={curveMonotoneX}
        />
        {!nofill && (
          <StyledAreaClosed
            {...{ data, color }}
            y={yPoints}
            x={xPoints}
            fill={findFill('gradient')}
            yScale={getAxis()}
            xScale={xScale}
            curve={curveMonotoneX}
          />
        )}
        {!nopattern ||
          (!nofill && (
            <StyledAreaClosed
              {...{ data, color }}
              y={yPoints}
              yScale={getAxis()}
              xScale={xScale}
              fill={findFill()}
              x={xPoints}
              curve={curveMonotoneX}
            />
          ))}
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
   * If true, there will be no fill on the line chart.
   **/
  nofill: PropTypes.bool,
  /**
   * If true, there will be no pattern on the line chart.
   */
  nopattern: PropTypes.bool
}

LineChart.defaultProps = {
  color: 'rgb(0, 157, 253)',
  nofill: false,
  nopattern: false
}
export default LineChart
