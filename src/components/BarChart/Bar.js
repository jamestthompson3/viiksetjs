import React, { Fragment, Component } from 'react'
import { Group } from '@vx/group'
import PropTypes from 'prop-types'

import { StyledGradient, StyledBar } from '../styledComponents'

class BarChart extends Component {
  componentDidMount() {
    this.props.declareBar()
  }

  shouldComponentUpdate(prevProps) {
    return prevProps.yPoints !== this.props.yPoints || prevProps.dataKey !== this.props.dataKey
  }
  render() {
    const {
      data,
      color,
      dataKey,
      xScale,
      xKey,
      height,
      notool,
      mouseMove,
      mouseLeave,
      nofill,
      inheritedScale,
      barProps
    } = this.props
    if (data.map(item => item[dataKey]).includes(undefined)) {
      // eslint-disable-next-line
      console.error(`BarChart: No data found with dataKey ${dataKey}`)
      return null
    }
    const xPoint = d => xScale(d[xKey])
    const barHeight = d => inheritedScale(d[dataKey])
    return (
      <Fragment>
        <StyledGradient color={color} id={`gradient${xKey}`} />
        {data.map(d => (
          <Group key={`bar${xPoint(d)}`}>
            <StyledBar
              width={xScale.bandwidth()}
              height={barHeight(d)}
              x={xPoint(d)}
              key="BarChart"
              y={height - barHeight(d)}
              data={d}
              fill={!nofill && `url(#gradient${xKey})`}
              onMouseMove={() => event => notool || mouseMove({ event, datum: d })}
              onMouseLeave={() => event => mouseLeave()}
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
   * Indicates the color of the BarChart
   */
  color: PropTypes.string
}

BarChart.defaultProps = {
  color: 'rgb(0, 157, 253)',
  nofill: false
}
export default BarChart
