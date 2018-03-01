import React, { Children, cloneElement, Component } from 'react'
import PropTypes from 'prop-types'
import { withParentSize } from '@vx/responsive'
import { Group } from '@vx/group'

import { Bar } from '@vx/shape'

import { formatTicks, formatXTicks } from '../../utils/formatUtils'
import { biaxial, determineViewBox, determineYScale, barChart } from '../../utils/chartUtils'
import withTooltip from '../Tooltip/withTooltip'
import withStream from '../Streaming/withStream'
import { StyledGridRows, StyledLeftAxis, StyledBottomAxis } from '../styledComponents/index'

const margin = { top: 18, right: 15, bottom: 15, left: 30 }

class StreamableChart extends Component {
  state = {
    chartData: false
  }
  componentDidMount() {
    this.calculateData()
    document.addEventListener('resize', this.calculateData())
  }

  componentWillUnmount() {
    const { socket } = this.state
    document.removeEventListener('resize', this.calculateData())
    socket && socket.close()
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.parentWidth !== this.props.parentWidth ||
      prevProps.parentHeight !== this.props.parentHeight
    ) {
      return this.calculateData()
    }
  }

  calculateData = () => {
    this.setState({ chartData: false })
    const {
      children,
      parentHeight,
      parentWidth,
      xKey,
      yKey,
      type,
      margin,
      connection,
      persist,
      streamParser,
      fromStream
    } = this.props
    if (!connection) {
      console.error('Connection string is needed for StreamableChart')
      return null
    }
    const biaxialChildren = biaxial(children)
    const width = parentWidth - margin.left - margin.right
    const height = parentHeight - margin.top - margin.bottom
    const socket = new window.WebSocket(connection)
    socket.onmessage = message => {
      const data = streamParser ? streamParser(message) : message
      return fromStream(data, biaxialChildren, width, height, xKey, yKey, type, margin, persist)
    }
    this.setState({
      socket,
      biaxialChildren,
      width,
      height
    })
  }
  render() {
    const { biaxialChildren, width, height } = this.state
    const {
      parentHeight,
      parentWidth,
      children,
      viewBox,
      data,
      xScale,
      yScale,
      yPoints,
      xKey,
      formatY,
      formatX,
      labelY,
      labelYProps,
      labelX,
      labelXProps,
      numXTicks,
      numYTicks,
      stroke,
      nogrid,
      color
    } = this.props
    return (
      <svg
        width={parentWidth}
        height={parentHeight}
        preserveAspectRatio="none"
        viewBox={
          viewBox
            ? viewBox
            : determineViewBox({ biaxialChildren, margin, parentWidth, parentHeight })
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
            mouseMove: this.mouseMove,
            mouseLeave: this.mouseLeave,
            xKey,
            inheritedScale: yScale,
            formatY,
            numYTicks,
            formatX
          })
        )}
        <Group left={margin.left}>
          {barChart(children) || (
            <Bar width={width - margin.left} height={height} fill="transparent" />
          )}
          {!nogrid && <StyledGridRows scale={yScale} {...{ stroke }} width={width - margin.left} />}
          {biaxialChildren || (
            <StyledLeftAxis
              scale={determineYScale({ type: null, yPoints, height, margin })}
              color={color}
              numTicks={numYTicks}
              hideTicks
              tickFormat={formatY}
              label={labelY || ''}
              labelProps={labelYProps}
            />
          )}
        </Group>
        <StyledBottomAxis
          scale={xScale}
          {...{ color, height, margin, numTicks: numXTicks }}
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
  data: PropTypes.array.isRequired,
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
  type: PropTypes.oneOf(['ordinal', 'linear']),
  /**
   * A string indicating which data values should be used to create the x-axis
   */
  xKey: PropTypes.string,
  /**
   * A React component to return as a tooltip
   */
  tooltip: PropTypes.func,
  /**
   * A React component made with SVG to indicate the tooltip position
   */
  indicator: PropTypes.func,
  /**
   * A function which formats the yAxis
   */
  formatY: PropTypes.func,
  /**
   * A label for the yAxis
  labelY: PropTypes.string,
  /**
   * Label props object for yLabel
  labelYProps: PropTypes.object,
  /**
   * A label for the xAxis
   */
  labelX: PropTypes.string,
  /**
   * Label props object for xLabel
   */
  labelXProps: PropTypes.object,
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
   * An optional string for the chart viewbox
   */
  viewBox: PropTypes.string,
  /**
   * If true, no gridlines will be shown.
   */
  nogrid: PropTypes.bool,
  /**
   * If true, no tooltip will be shown.
   */
  notool: PropTypes.bool,
  /**
   * An optional prop for chart margins
   */
  margin: PropTypes.object
}

ChartArea.defaultProps = {
  data: [],
  persist: 2500,
  color: '#000',
  stroke: '#000',
  nogrid: false,
  formatY: formatTicks,
  labelY: '',
  labelX: '',
  numXTicks: 6,
  numYTicks: 4,
  labelYProps: { fontSize: 12, textAnchor: 'middle', fill: 'black' },
  labelXProps: { fontSize: 12, textAnchor: 'middle', fill: 'black', dy: '-0.5rem' },
  formatX: formatXTicks,
  margin: margin
}

export default withStream(withTooltip(withParentSize(ChartArea)))
