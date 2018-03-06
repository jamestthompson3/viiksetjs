import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Group } from '@vx/group'
import Bar from './Bar'
import { stack } from 'd3-shape'

class StackedBar extends Component {
  shouldComponentUpdate(prevProps) {
    return (
      !(prevProps.yPoints === this.props.yPoints) || !(prevProps.dataKey === this.props.dataKey)
    )
  }
  render() {
    const { data, top, left, y, xScale, yScale, zScale, keys, height } = this.props
    const series = stack().keys(keys)(data)
    const format = yScale.tickFormat ? yScale.tickFormat() : d => d
    const bandwidth = yScale.bandwidth()
    const step = yScale.step()
    const paddingInner = yScale.paddingInner()
    const paddingOuter = yScale.paddingOuter()
    return (
      <Group top={top} left={left}>
        {series &&
          series.map((s, i) => {
            return (
              <Group key={i}>
                {s.map((d, ii) => {
                  const barWidth = xScale(d[1]) - xScale(d[0])
                  return (
                    <Bar
                      key={`bar-group-bar-${i}-${ii}-${s.key}`}
                      x={xScale(d[0])}
                      y={yScale(y(d.data))}
                      width={barWidth}
                      height={bandwidth}
                      fill={zScale(s.key)}
                      data={{
                        bandwidth,
                        paddingInner,
                        paddingOuter,
                        step,
                        key: s.key,
                        value: d[0],
                        height: bandwidth,
                        width: barWidth,
                        y: y(d.data),
                        yFormatted: format(y(d.data)),
                        data: d.data
                      }}
                      {...restProps}
                    />
                  )
                })}
              </Group>
            )
          })}
      </Group>
    )
  }
}

StackedBar.propTypes = {
  data: PropTypes.array.isRequired,
  y: PropTypes.func.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  zScale: PropTypes.func.isRequired,
  keys: PropTypes.array.isRequired,
  top: PropTypes.number,
  left: PropTypes.number
}

export default StackedBar
