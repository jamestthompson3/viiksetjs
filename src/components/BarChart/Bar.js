import React, { Fragment, Component } from 'react'
import { get } from 'lodash'
import { Group } from '@vx/group'
import { scaleBand, scaleLinear } from 'd3-scale'
import PropTypes from 'prop-types'

import { StyledGradient, StyledBar } from '../styledComponents'
import { extractX } from '../../utils/dataUtils'

class BarChart extends Component {
  componentDidMount() {
    this.props.declareBar()
  }

  shouldComponentUpdate(prevProps) {
    return prevProps.yPoints !== this.props.yPoints || prevProps.dataKey !== this.props.dataKey
  }

  determineScales = ({ type }) => {
    const { margin, height, width, yPoints, xPoints } = this.props

    if (type === 'horizontal') {
      const xScale = scaleLinear()
        .domain([0, Math.max(...yPoints)])
        .range([margin.left, width])
      const yScale = scaleBand()
        .domain(yPoints)
        .range([height, margin.top])
        .padding(0.1)

      return { xScale, yScale }
    } else {
      const xScale = scaleBand()
        .domain(xPoints)
        .range([margin.left, width])
        .padding(0.1)
      const yScale = scaleLinear()
        .domain([Math.max(...yPoints), 0])
        .range([height, margin.top])

      return { xScale, yScale }
    }
  }

  render() {
    const {
      data,
      color,
      dataKey,
      xKey,
      height,
      notool,
      mouseMove,
      mouseLeave,
      nofill,
      type,
      inverted,
      barProps
    } = this.props

    if (data.map(item => get(item, dataKey)).includes(undefined)) {
      // eslint-disable-next-line
      console.error(`BarChart: No data found with dataKey ${dataKey}`)
      return null
    }

    const { xScale, yScale } = this.determineScales({ type })
    const xPoint = d => extractX(d, xKey)
    const barHeight = d => yScale(get(d, dataKey))
    const isHorizontal = type === 'horizontal'
    return (
      <Fragment>
        <StyledGradient color={color} id={`gradient${xKey}`} />
        {data.map(d => (
          <Group key={`bar${xPoint(d)}`}>
            <StyledBar
              width={xScale.bandwidth()}
              height={barHeight(d)}
              x={xScale(xPoint(d))}
              key="BarChart"
              y={isHorizontal ? barHeight(d) : inverted ? 0 : height - barHeight(d)}
              data={d}
              fill={!nofill && `url(#gradient${xKey})`}
              onMouseMove={() => event => notool || mouseMove({ event, datum: d })}
              onMouseLeave={() => () => mouseLeave()}
              {...barProps}
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
   * Indicates chart should go from top to bottom
   */
  inverted: PropTypes.boolean,
  /**
   * Indicates the color of the BarChart
   */
  color: PropTypes.string
}

BarChart.defaultProps = {
  color: 'rgb(0, 157, 253)',
  nofill: false,
  inverted: false
}

export default BarChart
