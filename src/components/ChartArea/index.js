import React, { Children, cloneElement, Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import { withParentSize } from '@vx/responsive'
import { Group } from '@vx/group'
import { AxisBottom, AxisLeft } from '@vx/axis'
import { Bar, Line } from '@vx/shape'
import { GridRows } from '@vx/grid'
import { scaleLinear } from 'd3-scale'
import { bisect } from 'd3-array'
import moment from 'moment'
import { flow, uniq, head } from 'lodash'

import {
  getX,
  getY,
  extractLabels,
  extractX,
  extractY,
  createScalarData
} from 'common/vx/utils/dataUtils'
import { formatTicks, formatXTicks } from 'common/vx/utils/formatUtils'
import { determineScale, biaxial, localPoint, determineViewBox } from '../../utils/chartUtils'
import withTooltip from '../Tooltip/withTooltip'
import { TooltipComponent } from '../styledComponents/index'

const margin = { top: 18, right: 15, bottom: 0, left: 30 }

class ChartArea extends Component {
  state = {
    chartData: false
  }
  componentDidMount() {
    this.calculateData()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      return this.calculateData()
    }
  }

  calculateData = () => {
    this.setState({ chartData: false })
    const { data, children, parentHeight, parentWidth, xKey, yKey, type, margin } = this.props
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
      formatter,
      stroke,
      color,
      yCoords,
      calculatedData,
      tooltip: Tooltip,
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
                formatter
              })
            )}
            <Group left={margin.left}>
              <Bar
                width={width - margin.left}
                height={height}
                fill="transparent"
                onMouseMove={() => event => {
                  // event.persist()
                  // event.stopPropagation()
                  this.mouseMove({ event })
                }}
                onMouseLeave={() => this.mouseLeave}
              />
              <GridRows
                lineStyle={{ pointerEvents: 'none' }}
                scale={yScale}
                width={width - margin.left}
                stroke={stroke}
              />
              {biaxialChildren || (
                <AxisLeft
                  scale={yScale}
                  numTicks={4}
                  stroke={color}
                  strokeWidth={2}
                  hideTicks
                  tickLabelProps={() => ({ fill: color, dx: '-2em' })}
                  tickFormat={formatter}
                />
              )}
            </Group>
            <AxisBottom
              scale={xScale}
              stroke={color}
              top={height}
              numTicks={6}
              tickLabelProps={() => ({
                fill: color,
                dy: '-0.25rem',
                fontWeight: '900',
                textAnchor: 'left',
                fontSize: 11
              })}
              hideTicks
              tickFormat={val => formatXTicks(val)}
            />
            {x && (
              <Fragment>
                <Line
                  from={{ x: x, y: 0 }}
                  to={{ x: x, y: Math.max(...yCoords) }}
                  stroke="#fff"
                  strokeWidth={1}
                  strokeOpacity={0.5}
                  style={{ pointerEvents: 'none' }}
                />
                {yCoords.map((coord, i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={coord}
                    fill="rgb(28, 42, 44)"
                    stroke={color}
                    strokeWidth={1}
                    style={{ pointerEvents: 'none' }}
                    fillOpacity={1}
                    r={4}
                  />
                ))}
              </Fragment>
            )}
          </svg>
          {x && <Tooltip tooltipData={calculatedData} left={x} color={color} />}
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
   * A string indicating which data values should be used to create the x-axis
   */
  xKey: PropTypes.string,
  /**
   * A React component to return as a tooltip
   */
  tooltip: PropTypes.func,
  /**
   * A function which formats the axes
   */
  formatter: PropTypes.func,
  /**
   * An optional string for the chart viewbox
   */
  viewBox: PropTypes.string,
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
  formatter: formatTicks,
  margin: margin
}

export default withTooltip(withParentSize(ChartArea))
