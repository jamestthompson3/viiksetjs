import React, { Children, cloneElement, Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Group } from '@vx/group'
import { Bar } from '@vx/shape'
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
import {
  determineXScale,
  biaxial,
  localPoint,
  determineViewBox,
  determineYScale,
  barChart,
  findTooltipX
} from '../../utils/chartUtils'
import withTooltip from '../Tooltip/withTooltip'
import withParentSize from '../Responsive/withParentSize'
import {
  TooltipComponent,
  Indicator,
  StyledGridRows,
  StyledLeftAxis,
  StyledBottomAxis
} from '../styledComponents/index'

const margin = { top: 18, right: 15, bottom: 15, left: 30 }

class ChartArea extends Component {
  state = {
    chartData: false
  }
  componentDidMount() {
    this.calculateData()
  }

  componentDidUpdate(prevProps) {
    const dataWasChanged = prevProps.data !== this.props.data
    const widthWasChanged = prevProps.size && prevProps.size.width !== this.props.size.width
    const heightWasChanged = prevProps.size && prevProps.size.height !== this.props.size.height
    const typeWasChanged = prevProps.type !== this.props.type
    if (dataWasChanged || widthWasChanged || heightWasChanged || typeWasChanged) {
      return this.calculateData()
    }
  }
  // TODO WORK WITH DT OBJECTS
  calculateData = () => {
    this.setState({ chartData: false })
    const { data, children, size, xKey, yKey, type, margin } = this.props
    if (isEmpty(data)) {
      // eslint-disable-next-line
      console.error('Data is empty, cannot calculate chart')
      return null
    }
    const biaxialChildren = biaxial(children)
    const dataKeys = extractLabels(data[0])
    const width = size.width - margin.left - margin.right
    const height = size.height - margin.top - margin.bottom
    const xPoints = uniq(getX(data, xKey)).map(
      datum =>
        typeof datum === 'string' && moment(datum).isValid() ? moment(datum).toDate() : datum
    )
    const yPoints = getY(data, yKey)
    const yScale = determineYScale({ type, yPoints, height, margin })
    const yScales = biaxialChildren && createScalarData(data, dataKeys, height, margin)
    const xScale = determineXScale({ type, width, xPoints, margin })
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
  mouseMove = ({ event, datum }) => {
    const { xPoints, xScale, yScale, yScales, dataKeys } = this.state
    const { data, updateTooltip, xKey, type } = this.props
    const svgPoint = localPoint(this.chart, event).x
    if (datum) {
      return updateTooltip({ calculatedData: datum, x: svgPoint, mouseX: svgPoint })
    }
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
        const calculatedX = head(extractX(calculatedData, xKey))
        const x = findTooltipX({ type, calculatedX, xScale })
        const yCoords = yScales
          ? dataKeys.map(key => yScales[key](calculatedData[key]))
          : extractY(calculatedData).map(item => yScale(item))
        return updateTooltip({ calculatedData, x, mouseX: svgPoint, yCoords })
      }
    )(xValue)
  }

  mouseLeave = () => this.props.updateTooltip({ calculatedData: null, x: null, yCoords: null })
  render() {
    const {
      width,
      height,
      xScale,
      yScale,
      biaxialChildren,
      chartData,
      yPoints,
      xPoints
    } = this.state
    const {
      size,
      children,
      viewBox,
	data,
	noYAxis,
      xKey,
      formatY,
      formatX,
      yKey,
      labelY,
      labelYProps,
      labelX,
      labelXProps,
      yTickLabelProps,
      xTickLabelProps,
      numXTicks,
      numYTicks,
      type,
      stroke,
      nogrid,
      notool,
      color,
      yCoords,
      calculatedData,
      tooltip: Tooltip,
      indicator: Indicator,
      mouseX,
      x
    } = this.props
    return (
      chartData && (
        <Fragment>
          <svg
            width={size.width}
            height={size.height}
            preserveAspectRatio="none"
            viewBox={viewBox || determineViewBox(biaxialChildren, margin, size.width, size.height)}
            ref={svg => (this.chart = svg)}
          >
            {Children.map(children, child =>
              cloneElement(child, {
                data,
                xScale,
                margin,
                height,
                yPoints,
                xPoints,
                width,
                notool,
                type,
                mouseMove: this.mouseMove,
                mouseLeave: this.mouseLeave,
                xKey,
                yKey,
                inheritedScale: yScale,
                formatY,
                numYTicks,
                formatX
              })
            )}
            <Group left={margin.left}>
              {barChart(children) || (
                <Bar
                  width={width - margin.left}
                  height={height}
                  fill="transparent"
                  onMouseMove={() => event => {
                    notool || this.mouseMove({ event })
                  }}
                  onMouseLeave={() => this.mouseLeave}
                />
              )}
              {!nogrid && (
                <StyledGridRows scale={yScale} {...{ stroke }} width={width - margin.left} />
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
                    {...{ color, numTicks: numYTicks, tickLabels: yTickLabelProps }}
                    hideTicks
                    tickFormat={formatY}
                    label={labelY || ''}
                    labelProps={labelYProps}
                  />
                )}
            </Group>
            <StyledBottomAxis
              scale={xScale}
              {...{ color, height, margin, numTicks: numXTicks, tickLabels: xTickLabelProps }}
              hideTicks
              tickFormat={formatX}
              label={labelX || ''}
              labelProps={labelXProps}
            />
            {x &&
              !barChart(children) && (
                <Indicator {...{ yCoords, x, stroke, color, height, mouseX }} />
              )}
          </svg>
          {x && <Tooltip tooltipData={calculatedData} {...{ x, color, yCoords, mouseX, height }} />}
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
   * If true, no Yaxis will be shown
   */
  noYAxis: PropTypes.bool,
  /**
   * A label for the yAxis
   */
  labelY: PropTypes.string,
  /**
   * Label props object for yLabel
   */
  labelYProps: PropTypes.object,
  /**
   * Label props for y ticks
   */
  yTickLabelProps: PropTypes.function,
  /**
   * A label for the xAxis
   */
  labelX: PropTypes.string,
  /**
   * Label props object for xLabel
   */
  labelXProps: PropTypes.object,
  /**
   * Label props for x ticks
   */
  xTickLabelProps: PropTypes.function,
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
  color: '#000',
  stroke: '#000',
  tooltip: TooltipComponent,
    nogrid: false,
    noYAxis: false,
  indicator: Indicator,
  formatY: formatTicks,
  labelY: '',
  labelX: '',
  numXTicks: 6,
  numYTicks: 4,
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
  labelYProps: () => ({ fontSize: 12, textAnchor: 'middle', fill: 'black' }),
  labelXProps: () => ({ fontSize: 12, textAnchor: 'middle', fill: 'black', dy: '-0.5rem' }),
  formatX: formatXTicks,
  margin: margin
}

export default withTooltip(withParentSize(ChartArea))
