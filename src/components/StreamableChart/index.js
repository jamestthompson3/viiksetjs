import React, { Children, cloneElement, Component } from 'react'
import PropTypes from 'prop-types'
import { Group } from '@vx/group'

import { formatTicks, formatXTicks } from '../../utils/formatUtils'
import { biaxial, determineYScale } from '../../utils/chartUtils'
import withStream from '../Streaming/withStream'
import withParentSize from '../Responsive/withParentSize'
import { StyledGridRows, StyledLeftAxis, StyledBottomAxis } from '../styledComponents/index'

const margin = { top: 18, right: 15, bottom: 15, left: 30 }

class StreamableChart extends Component {
  state = {
    socket: null
  }

  componentDidMount() {
    const { connection } = this.props

    if (!connection) {
      // eslint-disable-next-line
      console.error('Connection string is needed for StreamableChart')
      return null
    }

    this.socket = new window.WebSocket(connection)
    this.calculateData()
  }

  componentWillUnmount() {
    this.socket.close()
  }

  componentDidUpdate() {
    const { stopPersist, data } = this.props

    if (stopPersist && data.length >= stopPersist) {
      this.socket.close()
    }
  }

  calculateData = () => {
    const {
      children,
      size,
      xKey,
      yKey,
      type,
      margin,
      mapStream,
      persist,
      streamParser,
      fromStream
    } = this.props
    const biaxialChildren = biaxial(children)
    const width = size.width - margin.left - margin.right
    const height = size.height - margin.top - margin.bottom
    this.socket.onclose = () => console.warn('connection closed')
    this.socket.onmessage = message =>
      fromStream({
        message: streamParser(message),
        biaxialChildren,
        mapStream,
        width,
        height,
        xKey,
        yKey,
        type,
        margin,
        persist
      })
    this.setState({
      biaxialChildren,
      width,
      height
    })
  }

  render() {
    const { biaxialChildren, width, height } = this.state
    const {
      size,
      children,
      determineViewBox,
      data,
      xScale,
      yScale,
      yPoints,
      xKey,
      formatY,
      formatX,
      labelY,
      type,
      labelYProps,
      labelX,
      labelXProps,
      xTickLabelProps,
      yTickLabelProps,
      numXTicks,
      numYTicks,
      stroke,
      nogrid,
      noYAxis,
      chartData,
      color
    } = this.props
    return !chartData ? (
      <h2>waiting on connection</h2>
    ) : (
      <svg
        width={size.width}
        height={size.height}
        preserveAspectRatio="none"
        viewBox={
          determineViewBox ? determineViewBox({ size, margin }) : `-10 0 ${size.width} ${height}`
        }
        ref={svg => (this.chart = svg)}
      >
        {Children.map(children, child =>
          cloneElement(child, {
            data,
            xScale,
            margin,
            height,
            notool: true,
            yPoints,
            width,
            xKey,
            inheritedScale: yScale,
            formatY,
            numYTicks,
            formatX
          })
        )}
        <Group left={margin.left}>
          {!nogrid && (
            <StyledGridRows
              scale={yScale}
              {...{ stroke }}
              width={width - margin.left}
              numTicks={3}
            />
          )}
          {biaxialChildren ||
            noYAxis || (
              <StyledLeftAxis
                scale={determineYScale({
                  type: type === 'horizontal' ? 'horizontal' : null,
                  yPoints,
                  height,
                  margin
                })}
                {...{ color, numTicks: numYTicks, tickLabelProps: yTickLabelProps }}
                hideTicks
                tickFormat={formatY}
                label={labelY || ''}
                labelProps={labelYProps}
              />
            )}
        </Group>
        <StyledBottomAxis
          scale={xScale}
          {...{ color, height, margin, numTicks: numXTicks, tickLabelProps: xTickLabelProps }}
          hideTicks
          tickFormat={formatX}
          label={labelX || ''}
          labelProps={labelXProps}
        />
      </svg>
    )
  }
}

StreamableChart.propTypes = {
  /**
   * If the data array reaches this limit, the connection will close
   */
  stopPersist: PropTypes.number,
  /**
   * If the data array reaches this limit, values will be popped from the beginning  of the array
   */
  persist: PropTypes.number,
  /**
   * Optional prop to apply color axes and x-ticks
   */
  color: PropTypes.string,
  /**
   * Optional prop to apply color gridlines
   */
  stroke: PropTypes.string,
  /**
   * A string indicating the type of scale the type should have, defaults to timeseries
   */
  type: PropTypes.oneOf(['ordinal', 'linear', 'horizontal']),
  /**
   * A string indicating which data values should be used to create the x-axis
   */
  xKey: PropTypes.string,
  /**
   * A function which formats the yAxis
   */
  formatY: PropTypes.func,
  /**
   * A label for the yAxis
   */
  labelY: PropTypes.string,
  /**
   * Label props object for yLabel
   */
  labelYProps: PropTypes.func,
  /**
   * Label props object for yTicks
   */
  yTickLabelProps: PropTypes.func,
  /**
   * Label props object for xTicks
   */
  xTickLabelProps: PropTypes.func,
  /**
   * A label for the xAxis
   */
  labelX: PropTypes.string,
  /**
   * Label props object for xLabel
   */
  labelXProps: PropTypes.func,
  /**
   * Number of ticks for xAxis
   */
  numXTicks: PropTypes.number,
  /**
   * Number of ticks for yAxis
   */
  numYTicks: PropTypes.number,
  /**
   * A function which formats the xAxis
   */
  formatX: PropTypes.func,
  /**
   * An optional function for determining the chart viewbox passed size and margin props
   */
  determineViewBox: PropTypes.func,
  /**
   * If true, no gridlines will be shown.
   */
  nogrid: PropTypes.bool,
  /**
   * An optional prop for chart margins
   */
  margin: PropTypes.object
}

StreamableChart.defaultProps = {
  data: [],
  persist: 2500,
  color: '#000',
  stroke: '#000',
  nogrid: false,
  noYAxis: false,
  formatY: formatTicks,
  streamParser: message => message,
  mapStream: (data, message) => [...data, message],
  labelY: '',
  labelX: '',
  numXTicks: 6,
  numYTicks: 4,
  labelYProps: () => ({ fontSize: 12, textAnchor: 'middle', fill: 'black' }),
  labelXProps: () => ({ fontSize: 12, textAnchor: 'middle', fill: 'black', dy: '-0.5rem' }),
  yTickLabelProps: () => ({
    dy: '-0.25rem',
    dx: '-1.75rem',
    strokeWidth: '0.5px',
    fontWeight: '400',
    textAnchor: 'left',
    fontSize: 12
  }),
  xTickLabelProps: () => ({
    dy: '-0.25rem',
    fontWeight: '400',
    strokeWidth: '0.5px',
    textAnchor: 'left',
    fontSize: 12
  }),
  formatX: formatXTicks,
  margin: margin
}

export default withStream(withParentSize(StreamableChart))
