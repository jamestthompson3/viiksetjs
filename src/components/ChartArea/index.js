// @flow
import * as React from 'react'
import { Group } from '@vx/group'
import { Bar } from '@vx/shape'
import { bisect } from 'd3-array'
import flow from 'lodash/flow'
import head from 'lodash/head'
import get from 'lodash/get'
import memoize from 'lodash/memoize'
import merge from 'lodash/merge'

import { extractX, extractY, createScalarData } from '../../utils/dataUtils'
import { formatTicks, formatXTicks } from '../../utils/formatUtils'
import { localPoint, findTooltipX, recursiveCloneChildren, biaxial } from '../../utils/chartUtils'
import DataContext from '../DataContext'
import { type Size } from '../DataContext'
import withTooltip from '../Tooltip/withTooltip'
import {
  Indicator,
  StyledGridRows,
  defaultTooltipRenderer,
  defaultTooltipContent
} from '../styledComponents'

import { type Margin, type ScaleFunction } from '../../types/index'
import { buildLeftAxis, buildBottomAxis } from '../common'

const margin = { top: 18, right: 15, bottom: 15, left: 30 }

const defaultAxes = {
  x: {
    tickLabelProps: () => ({
      fontWeight: 400,
      strokeWidth: '0.5px',
      textAnchor: 'start',
      fontSize: 12
    }),
    numTicks: 6,
    label: '',
    stroke: '#000',
    tickStroke: 'transparent',
    labelProps: { fontSize: 12, textAnchor: 'middle', fill: 'black', dy: -10 },
    tickFormat: formatXTicks
  },
  y: {
    tickLabelProps: () => ({
      strokeWidth: '0.5px',
      fontWeight: 400,
      textAnchor: 'end',
      fontSize: 12
    }),
    numTicks: 4,
    label: '',
    stroke: '#000',
    tickStroke: 'transparent',
    tickFormat: formatTicks,
    labelProps: { fontSize: 12, textAnchor: 'middle', fill: 'black' }
  }
}

const defaultTooltip = {
  indicator: Indicator,
  renderer: defaultTooltipRenderer,
  content: defaultTooltipContent,
  styles: {}
}

class ChartArea extends React.PureComponent<Props, State> {
  chart = null

  state = {
    bar: false
  }

  buildAxis = (biaxialChildren, position) => {
    const { axes, color } = this.props
    const { y, x } = merge({}, defaultAxes, axes)

    if (position === 'left' && !biaxialChildren && axes.y !== null) {
      return buildLeftAxis({ y, color })
    }

    if (position === 'bottom' && axes.x !== null) {
      return buildBottomAxis({ x, color })
    }

    return () => null
  }

  buildGrid = () => {
    const { noGrid, gridStroke } = this.props
    if (noGrid) return () => null
    return React.memo(function Grid({ yScale, width, left }) {
      return <StyledGridRows scale={yScale} stroke={gridStroke} width={width - left} />
    })
  }

  // To prevent tooltips from not showing on bar chart due to minification changing names
  declareBar = () => this.setState({ bar: true })

  mouseMove = memoize(
    ({ event, xPoints, xScale, yScale, yScales, dataKeys, datum }: MouseMove): void => {
      const { data, updateTooltip, children, xKey, type, tooltip, noTool } = this.props
      if (tooltip === null || noTool) return

      const svgPoint = localPoint(this.chart, event)
      const mouseX = get(svgPoint, 'x')
      const mouseY = get(svgPoint, 'y')

      // Case for data contained in bar / pie charts:
      // there won't be an associated value based on precise
      // cursor position
      if (datum) {
        return updateTooltip({
          calculatedData: datum,
          x: mouseX,
          mouseX,
          mouseY,
          showTooltip: true
        })
      }

      const xValueOffset = biaxial(children) ? 0 : margin.right
      const xValue = xScale.invert(get(svgPoint, 'x') - xValueOffset)

      return flow(
        xValue => bisect(xPoints, xValue),
        index => {
          // Find the closest data point based on the actual mouse position
          const bounds = { dLeft: data[index - 1], dRight: data[index] }
          // If the calculated xValue minus the value to the left is greater than
          // The indexed value minuse the calcuated value, take the right hand
          // value if available. If not, take the left hand value if available.
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
            mouseX,
            mouseY,
            yCoords
          })
        }
      )(xValue)
    }
  )

  mouseLeave = () =>
    this.props.updateTooltip({ calculatedData: null, x: null, yCoords: null, showTooltip: false })

  render() {
    const { bar } = this.state
    const {
      children,
      determineViewBox,
      data,
      xKey,
      yKey,
      type,
      orientation,
      axes,
      stroke,
      tooltip,
      noTool,
      color,
      yCoords,
      calculatedData,
      glyphRenderer,
      mouseX,
      showTooltip,
      mouseY,
      x
    } = this.props
    const biaxialChildren = children && biaxial(children)
    const LeftAxis = this.buildAxis(biaxialChildren, 'left')
    const BottomAxis = this.buildAxis(biaxialChildren, 'bottom')
    const Grid = this.buildGrid()
    const {
      indicator: Indicator,
      renderer: tooltipRenderer,
      styles: tooltipStyles,
      content: tooltipContent
    } = merge({}, defaultTooltip, tooltip)
    return (
      <DataContext {...{ data, xKey, yKey, type, margin, orientation, x }}>
        {({ xScale, size, dataKeys, data, width, height, yPoints, xPoints, yScale }) => (
          <div style={{ width: size.width, height: size.height }}>
            <svg
              width={size.width}
              height={size.height}
              preserveAspectRatio="none"
              viewBox={
                determineViewBox
                  ? determineViewBox({ size, margin })
                  : `-10 0 ${size.width} ${size.height}`
              }
              ref={svg => (this.chart = svg)}
            >
              <Group left={biaxialChildren ? 0 : margin.right}>
                <Group left={margin.left}>
                  <Grid yScale={yScale} width={width} left={margin.left} />
                  <LeftAxis {...{ type, orientation, color, yPoints, height, margin }} />
                </Group>
                {recursiveCloneChildren(children, {
                  data,
                  xScale,
                  margin,
                  height,
                  axes,
                  yPoints,
                  xPoints,
                  width,
                  declareBar: this.declareBar,
                  type,
                  orientation,
                  mouseMove: this.mouseMove,
                  mouseLeave: this.mouseLeave,
                  xKey,
                  yKey,
                  inheritedScale: yScale
                })}
                {bar || (
                  <Bar
                    width={size.width}
                    x={0}
                    y={0}
                    height={height}
                    fill="transparent"
                    onMouseMove={event =>
                      this.mouseMove({
                        event,
                        xPoints,
                        xScale,
                        yScale,
                        yScales:
                          biaxialChildren && createScalarData(data, dataKeys, height, margin),
                        dataKeys
                      })
                    }
                    onTouchMove={event =>
                      this.mouseMove({
                        event,
                        xPoints,
                        xScale,
                        yScale,
                        yScales:
                          biaxialChildren && createScalarData(data, dataKeys, height, margin),
                        dataKeys
                      })
                    }
                    onTouchEnd={this.mouseLeave}
                    onMouseLeave={this.mouseLeave}
                  />
                )}
                {glyphRenderer && glyphRenderer({ width, height, xScale, yScale, margin })}
                <BottomAxis scale={xScale} height={height} margin={margin} />
                {x && !bar && <Indicator {...{ yCoords, x, stroke, color, height, mouseX }} />}
              </Group>
            </svg>
            {showTooltip &&
              !noTool &&
              tooltipRenderer({
                ...{
                  tooltipData: calculatedData,
                  tooltipContent,
                  yCoords,
                  tooltipStyles,
                  x,
                  mouseX,
                  mouseY,
                  height,
                  color
                }
              })}
          </div>
        )}
      </DataContext>
    )
  }
}

ChartArea.defaultProps = {
  data: [],
  margin,
  axes: defaultAxes,
  tooltip: defaultTooltip,
  glyphRenderer: () => null
}

type MouseMove = {
  event: SyntheticMouseEvent<SVGMatrix>,
  xPoints: number[],
  xScale: ScaleFunction,
  yScale: ScaleFunction,
  yScales: false | { [key: string]: ScaleFunction },
  dataKeys: string[],
  datum?: Object
}

export type TooltipData = {
  calculatedData?: ?Object,
  tooltipData?: Object,
  tooltipContent: Object => React.Node,
  x: ?number,
  mouseX: number,
  mouseY: number,
  showTooltip: boolean,
  yCoords: ?(number[]),
  stroke: string,
  color: string,
  height: number
}

type State = {
  bar: boolean
}

type AxisProps = {
  format: (d: any, i: number) => string,
  tickLabelProps: (d: any, i: number) => Function,
  labelProps: Object,
  label: string,
  numTicks: number,
  stroke: string
}

type TooltipProps = {
  indicator: ($Shape<TooltipData>) => React.Node,
  renderer: ($Shape<TooltipData>) => React.Node,
  content: (tooltipData: Object) => React.Node,
  styles: {
    wrapper: Object,
    content: Object
  }
}

type GridProps = {
  type: 'mesh' | 'horizontal' | 'vertical',
  stroke: string
}

type Props = {
  data: Object[],
  calculatedData?: Object,
  yCoords?: number[],
  yKey?: string,
  mouseX?: number,
  mouseY?: number,
  x: number,
  tooltipData?: Object,
  showTooltip: boolean,
  children: React.Node,
  color: string,
  type: 'ordinal' | 'linear',
  orientation?: 'horizontal',
  axes: { x: $Shape<AxisProps>, y: $Shape<AxisProps> },
  grid: GridProps,
  tooltip: $Shape<TooltipProps>,
  xKey?: string,
  nogrid: boolean,
  updateTooltip: ($Shape<TooltipData>) => mixed,
  glyphRenderer: ({
    width: number,
    height: number,
    xScale: ScaleFunction,
    yScale: ScaleFunction,
    margin: Margin
  }) => React.Node,
  determineViewBox: ({ size: Size, margin: Margin }) => string,
  margin: Margin
}

export default withTooltip(ChartArea)
