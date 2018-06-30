import React, { Fragment, Component } from 'react'
import { scaleLinear } from 'd3-scale'
import get from 'lodash/get'
import { curveMonotoneX } from '@vx/curve'
import PropTypes from 'prop-types'

import {
  StyledGradient,
  StyledPatternLines,
  StyledLinePath,
  StyledAreaClosed,
  findColor
} from '../styledComponents'
import { parseObject, checkMoment } from '../../utils/dataUtils'

class LineChart extends Component {
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
      nofill,
      solidfill,
      height,
      margin,
      nopattern,
      inheritedScale,
      axisId,
      areaProps,
      lineProps
    } = this.props

    // Check if data exists
    if (data.map(item => get(item, dataKey)).includes(undefined)) {
      // eslint-disable-next-line
      console.error(`LineChart: No data found with dataKey ${dataKey}`)
      return null
    }

    if (axisId && data.map(item => get(item, axisId)).includes(undefined)) {
      // eslint-disable-next-line
      console.error(`LineChart: No data found with axisId ${axisId}`)
      return null
    }

    const yPoints = d => get(d, dataKey)
    const xPoints = d => (xKey ? get(d, xKey) : new Date(parseObject(d, 'string', checkMoment)))
    const dataPoints = data.map(item => get(item, dataKey))
    const yScale = scaleLinear()
      .domain([0, Math.max(...dataPoints)])
      .range([height, margin.top + margin.top])
    const getAxis = () => (!axisId ? inheritedScale : yScale)
    const findFill = gradient => (gradient ? `url(#gradient${dataKey})` : `url(#dlines${dataKey})`)

    return (
      <Fragment>
        {!nofill && (
          <Fragment>
            <StyledGradient color={color} id={`gradient${dataKey}`} />
            <StyledPatternLines color={color} id={`dlines${dataKey}`} />
          </Fragment>
        )}
        <StyledLinePath
          {...{ data, color }}
          y={yPoints}
          x={xPoints}
          yScale={getAxis()}
          xScale={xScale}
          curve={curveMonotoneX}
          {...lineProps}
        />
        {!nofill && (
          <StyledAreaClosed
            {...{ data, color }}
            y={yPoints}
            x={xPoints}
            fill={solidfill ? findColor(this.props) : findFill('gradient')}
            yScale={getAxis()}
            xScale={xScale}
            curve={curveMonotoneX}
            {...areaProps}
          />
        )}
        {nopattern ||
          (!nofill && (
            <StyledAreaClosed
              {...{ data, color }}
              y={yPoints}
              yScale={getAxis()}
              xScale={xScale}
              fill={findFill()}
              x={xPoints}
              curve={curveMonotoneX}
              {...areaProps}
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
