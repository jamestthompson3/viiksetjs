import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Group } from '@vx/group'
import Bar from './Bar'
import { stack } from 'd3-shape'
import { scaleOrdinal } from 'd3-scale'

import { extractLabels } from '../../utils/dataUtils'

class StackedBar extends Component {
  shouldComponentUpdate(prevProps) {
    return (
      !(prevProps.yPoints === this.props.yPoints) || !(prevProps.dataKey === this.props.dataKey)
    )
  }

  determineScale = type => {
    const { xScale, yScale } = this.props
    return type === 'horizontal' ? xScale : yScale
  }
  render() {
    const { data, top, left, y, xScale, yScale, type, colors, xKey } = this.props
    const keys = extractLabels(data[0])
    const zScale = scaleOrdinal()
      .domain(keys)
      .range(colors)
    const scale = this.determineScale(type)
    const series = stack().keys(keys)(data)
    const bandwidth = scale.bandwidth()
    const xPoint = d => xScale(d[xKey])
    return (
      <Group top={top} left={left}>
        {series &&
          series.map((s, i) => (
            <Group key={i}>
              {s.map((d, ii) => {
                const barWidth = scale(d[1]) - scale(d[0])
                return (
                  <Bar
                    key={`bar-group-bar-${i}-${ii}-${s.key}`}
                    x={xPoint(d)}
                    y={yScale(y(d.data))}
                    width={barWidth}
                    height={bandwidth}
                    fill={zScale(s.key)}
                    data={d}
                    {...restProps}
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
  data: PropTypes.array.isRequired,
  y: PropTypes.func.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  colors: PropTypes.array.isRequired,
  top: PropTypes.number,
  left: PropTypes.number
}

export default StackedBar
