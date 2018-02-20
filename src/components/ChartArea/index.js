import React, { Children, cloneElement, Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import { withParentSize } from '@vx/responsive'
import { Group } from '@vx/group'

import { Bar } from '@vx/shape'
import { scaleLinear } from 'd3-scale'
import { bisect } from 'd3-array'
import moment from 'moment'
import { flow, uniq, head, isEmpty } from 'lodash'

import {
  getX,
  getY,
  extractLabels,
  extractX,
  extractY,
  createScalarData
} from '../../utils/dataUtils'
import { formatTicks, formatXTicks } from '../../utils/formatUtils'
import { determineScale, biaxial, localPoint, determineViewBox } from '../../utils/chartUtils'
import withTooltip from '../Tooltip/withTooltip'
import {
  TooltipComponent,
  Indicator,
  StyledGridRows,
  StyledLeftAxis,
  StyledBottomAxis
} from '../styledComponents/index'

const margin = { top: 18, right: 15, bottom: 0, left: 30 }

class ChartArea extends Component {
  state = {
    chartData: false
  }
  componentDidMount() {
    this.calculateData()
    document.addEventListener('resize', this.calculateData())
  }

  componentWillUnmount() {
    document.removeEventListener('resize', this.calculateData())
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.data !== this.props.data ||
      prevProps.parentWidth !== this.props.parentWidth ||
      prevProps.parentHeight !== this.props.parentHeight
    ) {
      return this.calculateData()
    }
  }

  calculateData = () => {
    this.setState({ chartData: false })
    const { data, children, parentHeight, parentWidth, xKey, yKey, type, margin } = this.props
    if (isEmpty(data)) {
      console.error('Data is empty, cannot calculate chart')
      return null
    }
    const biaxialChildren = biaxial(children)
    const dataKeys = extractLabels(data[0])
    const width = parentWidth - margin.left - margin.right
    const height = parentHeight - margin.top - margin.bottom
    const xPoints = uniq(getX(data, xKey)).map(
      datum => (moment(datum).isValid() ? moment(datum).toDate() : datum)
    )
    const yPoints = getY(data, yKey)
    const yScale = scaleLinear()
      .domain([0, Math.max(...yPoints)])
      .range([height, margin.top])
    const yScales = biaxialChildren ? createScalarData(data, dataKeys, height, margin) : null
    const xScale = determineScale({ type, width, xPoints, margin })
    return this.setState({
      width,
      height,
      xPoints,
      xScale,
      yScale,
      yPoints,
      biaxialChildren,
      yScales,
      dataKeys,
      chartData: true
    })
  }
  mouseMove = ({ event }) => {
    const { xPoints, xScale, yScale, yScales, dataKeys } = this.state
    const { data, updateTooltip } = this.props
    const svgPoint = localPoint(this.chart, event).x
    const xValue = xScale.invert(svgPoint)
    flow(
      xValue => bisect(xPoints, xValue),
      index => {
        const bounds = { dLeft: data[index - 1], dRight: data[index] }
        return xValue - xPoints[index - 1] > xPoints[index] - xValue
          ? bounds.dRight || bounds.dLeft
          : bounds.dLeft || bounds.dRight
      },
      calculatedData => {
        const x = xScale(moment(head(extractX(calculatedData))))
        const yCoords = yScales
          ? dataKeys.map(key => yScales[key](calculatedData[key]))
          : extractY(calculatedData).map(item => yScale(item))
        return updateTooltip({ calculatedData, x, yCoords })
      }
    )(xValue)
  }

  mouseLeave = () => this.props.updateTooltip({ calculatedData: null, x: null, yCoords: null })
  render() {
    const { width, height, xScale, yScale, biaxialChildren, chartData, yPoints } = this.state
    const {
      parentHeight,
      parentWidth,
      children,
      viewBox,
      data,
      xKey,
      formatY,
      formatX,
      stroke,
      nogrid,
      notool,
      color,
      yCoords,
      calculatedData,
      tooltip: Tooltip,
      indicator: Indicator,
      x
    } = this.props
    return (
      chartData && (
        <Fragment>
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
                chartData,
                yPoints,
                width,
                xKey,
                inheritedScale: yScale,
                formatY,
                formatX
              })
            )}
            <Group left={margin.left}>
              <Bar
                width={width - margin.left}
                height={height}
                fill="transparent"
                onMouseMove={() => event => {
                  notool || this.mouseMove({ event })
                }}
                onMouseLeave={() => this.mouseLeave}
              />
              {!nogrid && (
                <StyledGridRows scale={yScale} {...{ stroke }} width={width - margin.left} />
              )}
              {biaxialChildren || (
                <StyledLeftAxis scale={yScale} color={color} hideTicks tickFormat={formatY} />
              )}
            </Group>
            <StyledBottomAxis
              scale={xScale}
              {...{ color, height }}
              hideTicks
              tickFormat={formatX}
            />
            {x && <Indicator {...{ yCoords, x, stroke, color, height }} />}
          </svg>
          {x && <Tooltip tooltipData={calculatedData} {...{ x, color, yCoords }} />}
        </Fragment>
      )
    )
  }
}

ChartArea.propTypes = {
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
  color: '#000',
  stroke: '#000',
  tooltip: TooltipComponent,
  nogrid: false,
  indicator: Indicator,
  formatY: formatTicks,
  formatX: formatXTicks,
  margin: margin
}

export default withTooltip(withParentSize(ChartArea))
