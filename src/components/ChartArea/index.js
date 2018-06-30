import React, { Children, cloneElement, Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Group } from '@vx/group'
import { Bar } from '@vx/shape'
import bisect from 'd3-array/bisect'
import flow from 'lodash/flow'
import uniq from 'lodash/uniq'
import head from 'lodash/head'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

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
  determineYScale,
  findTooltipX
} from '../../utils/chartUtils'
import withTooltip from '../Tooltip/withTooltip'
import withParentSize from '../Responsive/withParentSize'
import {
  Indicator,
  StyledGridRows,
  defaultTooltipRenderer,
  defaultTooltipContent,
  StyledLeftAxis,
  StyledBottomAxis
} from '../styledComponents'

const margin = { top: 18, right: 15, bottom: 15, left: 30 }

class ChartArea extends Component {
  state = {
    bar: false,
    chartData: false
  }

  componentDidMount() {
    this.calculateData()
  }

  componentDidUpdate(prevProps) {
    const dataWasChanged = prevProps.data !== this.props.data
    const widthWasChanged = prevProps.size && prevProps.size.width !== this.props.size.width
    const heightWasChanged =
      prevProps.size.height !== 0 && prevProps.size.height !== this.props.size.height
    const typeWasChanged = prevProps.type !== this.props.type

    if (dataWasChanged || widthWasChanged || heightWasChanged || typeWasChanged) {
      return this.calculateData()
    }
  }

  // To prevent tooltips from not showing on bar chart due to minification changing names
  declareBar = () => this.setState({ bar: true })

  calculateData = () => {
    const { children, size, xKey, yKey, type, margin, data } = this.props

    if (isEmpty(data)) {
      // eslint-disable-next-line
      console.error('Data is empty, cannot calculate chart')
      return null
    }

    const biaxialChildren = biaxial(children)
    const dataKeys = extractLabels(data[0])
    const width = size.width - margin.left - margin.right
    const height = size.height === 0 ? 300 : size.height - margin.top - margin.bottom
    const xPoints = uniq(getX(data, xKey))
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

  mouseMove = ({ event, xPoints, xScale, yScale, yScales, dataKeys, datum }) => {
    const { data, updateTooltip, xKey, type } = this.props
    const svgPoint = localPoint(this.chart, event)

    if (datum) {
      return updateTooltip({
        calculatedData: datum,
        x: get(svgPoint, 'x'),
        mouseX: get(svgPoint, 'x'),
        mouseY: get(svgPoint, 'y'),
        showTooltip: true
      })
    }

    const xValue = xScale.invert(get(svgPoint, 'x'))
    return flow(
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
        return updateTooltip({
          calculatedData,
          x,
          showTooltip: true,
          mouseX: get(svgPoint, 'x'),
          mouseY: get(svgPoint, 'y'),
          yCoords
        })
      }
    )(xValue)
  }

  mouseLeave = () =>
    this.props.updateTooltip({ calculatedData: null, x: null, yCoords: null, showTooltip: false })

  render() {
    const {
      bar,
      width,
      height,
      xScale,
      yScale,
      yScales,
      biaxialChildren,
      chartData,
      dataKeys,
      yPoints,
      xPoints
    } = this.state
    const {
      size,
      children,
      determineViewBox,
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
      xAxisProps,
      yAxisProps,
      numXTicks,
      numYTicks,
      type,
      stroke,
      nogrid,
      notool,
      gridStroke,
      color,
      yCoords,
      calculatedData,
      tooltipRenderer,
      tooltipContent,
      indicator: Indicator,
      mouseX,
      showTooltip,
      mouseY,
      x
    } = this.props

    return (
      chartData && (
        <Fragment>
          <svg
            width={size.width}
            height={height + margin.top + margin.bottom}
            preserveAspectRatio="none"
            viewBox={
              determineViewBox
                ? determineViewBox({ size, margin })
                : `-10 0 ${size.width} ${size.height}`
            }
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
                declareBar: this.declareBar,
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
              {bar || (
                <Bar
                  width={width}
                  height={height}
                  fill="transparent"
                  onMouseMove={() => event => {
                    notool || this.mouseMove({ event, xPoints, xScale, yScale, yScales, dataKeys })
                  }}
                  onTouchMove={() => event => {
                    notool || this.mouseMove({ event, xPoints, xScale, yScale, yScales, dataKeys })
                  }}
                  onTouchEnd={() => this.mouseLeave}
                  onMouseLeave={() => this.mouseLeave}
                />
              )}
              {!nogrid && (
                <StyledGridRows
                  scale={yScale}
                  stroke={gridStroke || stroke}
                  width={width - margin.left}
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
                    {...{
                      color,
                      numTicks: numYTicks,
                      tickLabelProps: yTickLabelProps,
                      ...yAxisProps
                    }}
                    hideTicks
                    tickFormat={formatY}
                    label={labelY || ''}
                    labelProps={labelYProps}
                  />
                )}
            </Group>
            <StyledBottomAxis
              scale={xScale}
              {...{
                color,
                height,
                margin,
                numTicks: numXTicks,
                tickLabelProps: xTickLabelProps,
                ...xAxisProps
              }}
              hideTicks
              tickFormat={formatX}
              label={labelX || ''}
              labelProps={labelXProps}
            />
            {x && !bar && <Indicator {...{ yCoords, x, stroke, color, height, mouseX }} />}
          </svg>
          {showTooltip &&
            tooltipRenderer({
              ...{
                tooltipData: calculatedData,
                tooltipContent,
                yCoords,
                x,
                mouseX,
                mouseY,
                height,
                color
              }
            })}
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
   * Optional prop to apply color gridlines and/or indicator
   */
  stroke: PropTypes.string,
  /**
   * Optional prop to apply color gridlines
   */
  gridStroke: PropTypes.string,
  /**
   * A string indicating the type of scale the type should have, defaults to timeseries
   */
  type: PropTypes.oneOf(['ordinal', 'linear', 'horizontal']),
  /**
   * A string indicating which data values should be used to create the x-axis
   */
  xKey: PropTypes.string,
  /**
   * A function that returns React component to return as a tooltip receives as props the following:
   * @param {Object} tooltipData - calculated data returned from tooltip calculations
   * @param {Number} x - x coordinate of closest data point
   * @param {Number} mouseX - x coordinate of mouse position
   * @param {Number} mouseY - y coordinate of mouse position
   * @param {Object[]} yCoords - array of y coordinates of closest data point(s)
   * @param {String} color - string of color inherited from ChartArea
   * @returns {ReactElement} Tooltip - TooltipComponent
   */
  tooltipRenderer: PropTypes.func,
  /**
   * A function that returns a React Component that renders inside the default tooltip container
   * @param {Object} tooltipData - calculated data returned from tooltip calculations
   * @returns {ReactElement} TooltipContent
   */
  tooltipContent: PropTypes.func,
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
  yTickLabelProps: PropTypes.func,
  /**
   * A label for the xAxis
   */
  labelX: PropTypes.string,
  /**
   * Label props object for xLabel
   */
  labelXProps: PropTypes.object,
  /**
   * Optional props object to be applied to the xAxis
   */
  xAxisProps: PropTypes.object,
  /**
   * Optional props object to be applied to the yAxis
   */
  yAxisProps: PropTypes.object,
  /**
   * Label props for x ticks
   */
  xTickLabelProps: PropTypes.func,
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
   * An optional function for the chart viewbox, passed size and margin props
   */
  determineViewBox: PropTypes.func,
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
  nogrid: false,
  notool: false,
  noYAxis: false,
  indicator: Indicator,
  tooltipRenderer: defaultTooltipRenderer,
  tooltipContent: defaultTooltipContent,
  formatY: formatTicks,
  labelY: '',
  labelX: '',
  numXTicks: 6,
  numYTicks: 4,
  yTickLabelProps: () => ({
    dy: '-0.25rem',
    dx: '-0.75rem',
    strokeWidth: '0.5px',
    fontWeight: 400,
    textAnchor: 'end',
    fontSize: 12
  }),
  xTickLabelProps: () => ({
    dy: '-0.25rem',
    fontWeight: 400,
    strokeWidth: '0.5px',
    textAnchor: 'start',
    fontSize: 12
  }),
  labelYProps: { fontSize: 12, textAnchor: 'middle', fill: 'black' },
  labelXProps: { fontSize: 12, textAnchor: 'middle', fill: 'black', dy: '-0.5rem' },
  formatX: formatXTicks,
  margin: margin
}

export default withTooltip(withParentSize(ChartArea))
