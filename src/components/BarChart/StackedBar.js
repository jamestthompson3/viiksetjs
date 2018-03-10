import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Group } from '@vx/group'
import { stack } from 'd3-shape'
import { scaleOrdinal, scaleBand, scaleLinear } from 'd3-scale'
import { get, flatten, sum, set } from 'lodash'

import { extractLabels } from '../../utils/dataUtils'
import { StyledBar } from '../styledComponents'

class StackedBar extends Component {
  shouldComponentUpdate(prevProps) {
    return !(prevProps.yPoints === this.props.yPoints) || !(prevProps.keys === this.props.keys)
  }

  determineScales = ({ type, data, keys }) => {
    const { margin, height, width, yPoints, xPoints } = this.props
    const dataDomain = Math.max(
      ...flatten(data.map(d => keys.map(key => get(d, key))).map(arr => sum(arr)))
    )
    if (type === 'horizontal') {
      const xScale = scaleLinear()
        .domain([0, dataDomain])
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
        .domain([dataDomain, 0])
        .range([height, margin.top])
      return { xScale, yScale }
    }
  }

  determineBarWidth = ({ d, isHorizontal, xScale, yScale }) => {
    if (isHorizontal) {
      return xScale(d[1]) - xScale(d[0])
    } else {
      return yScale(d[1]) - yScale(d[0])
    }
  }

  render() {
    const {
      data,
      type,
      colors,
      xKey,
      keys,
      yKey,
      width,
      height,
      margin,
      notool,
      mouseMove,
      mouseLeave
    } = this.props
    if (!keys) {
      // eslint-disable-next-line
      console.warn(
        'StackedBar: You have not provided the keys prop, this could explain unexpected render output'
      )
    }
    const zScale = scaleOrdinal()
      .domain(keys || extractLabels(data[0]))
      .range(colors)
    const { xScale, yScale } = this.determineScales({ type, data, keys })
    const isHorizontal = type === 'horizontal'
    const series = stack().keys(keys || extractLabels(data[0]))(data)
    const bandwidth = isHorizontal ? yScale.bandwidth() : xScale.bandwidth()
    const xPoint = d => xScale(d[xKey])
    const yPoint = d => yScale(d[yKey])
    return (
      <Group>
        {series &&
          series.map((s, i) => (
            <Group key={i}>
              {s.map((d, ii) => {
                const barWidth = this.determineBarWidth({ d, isHorizontal, xScale, yScale })
                return (
                  <StyledBar
                    key={`bar-group-bar-${i}-${ii}-${s.key}`}
                    x={isHorizontal ? width + margin.left - xScale(d[1]) : xPoint(d.data)}
                    y={isHorizontal ? yPoint(d.data) : height + margin.top - yScale(d[1])}
                    width={isHorizontal ? barWidth : bandwidth}
                    height={isHorizontal ? bandwidth : barWidth}
                    fill={zScale(s.key)}
                    data={d.data}
                    onMouseMove={data => event => {
                      const key = s.key
                      return notool || mouseMove({ event, datum: set({}, key, data[key]) })
                    }}
                    onMouseLeave={() => event => mouseLeave()}
                  />
                )
              })}
            </Group>
          ))}
      </Group>
    )
  }
}

StackedBar.propTypes = {
  xScale: PropTypes.func,
  inheritedScale: PropTypes.func,
  colors: PropTypes.array,
  top: PropTypes.number,
  left: PropTypes.number
}

export default StackedBar
