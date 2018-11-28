// @flow
import * as React from 'react'
import { Group } from '@vx/group'
import { Bar } from '@vx/shape'
import { bisect } from 'd3-array'
import flow from 'lodash/flow'
import head from 'lodash/head'
import get from 'lodash/get'

import { extractX, extractY, createScalarData } from '../../utils/dataUtils'
import { formatTicks, formatXTicks } from '../../utils/formatUtils'
import {
  localPoint,
  determineYScale,
  findTooltipX,
  recursiveCloneChildren,
  biaxial
} from '../../utils/chartUtils'
import DataContext from '../DataContext'
import { type Size } from '../DataContext'
import withTooltip from '../Tooltip/withTooltip'
import {
  Indicator,
  StyledGridRows,
  defaultTooltipRenderer,
  defaultTooltipContent,
  StyledLeftAxis,
  StyledBottomAxis
} from '../styledComponents'

import { type Margin, type ScaleFunction } from '../../types/index'

const margin = { top: 18, right: 15, bottom: 15, left: 30 }

class ChartArea extends React.Component<Props, State> {
  static axes = {
    x: {
      tickLabelProps: () => ({
        dy: '-0.25rem',
        fontWeight: 400,
        strokeWidth: '0.5px',
        textAnchor: 'start',
        fontSize: 12
      }),
      numTicks: 6,
      label: '',
      stroke: '#000',
      labelProps: { fontSize: 12, textAnchor: 'middle', fill: 'black', dy: '-0.5rem' },
      format: formatXTicks
    },
    y: {
      tickLabelProps: () => ({
        dy: '-0.25rem',
        dx: '-0.75rem',
        strokeWidth: '0.5px',
        fontWeight: 400,
        textAnchor: 'end',
        fontSize: 12
      }),
      numTicks: 4,
      label: '',
      stroke: '#000',
      format: formatTicks
    },
    labelProps: { fontSize: 12, textAnchor: 'middle', fill: 'black' }
  }

  static grid = {
    stroke: '#000',
    type: 'horizontal'
  }

  static tooltip = {
    indicator: Indicator,
    renderer: defaultTooltipRenderer,
    content: defaultTooltipContent,
    styles: {}
  }

  static defaultProps = {
    data: [],
    margin: margin,
    axes: () => this.axes,
    tooltip: () => this.tooltip,
    grid: this.grid,
    glyphRenderer: () => null
  }

  chart = null

  state = {
    bar: false
  }

  // To prevent tooltips from not showing on bar chart due to minification changing names
  declareBar = () => this.setState({ bar: true })

  mouseMove = ({ event, xPoints, xScale, yScale, yScales, dataKeys, datum }: MouseMove): mixed => {
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
      tooltip,
      grid,
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
    return (
      <DataContext {...{ data, xKey, yKey, type, margin, orientation, x }}>
        {({ xScale, size, dataKeys, data, width, height, yPoints, xPoints, yScale }) => (
          <div style={{ width: size.width, height: size.height }}>
            <svg
              width={width + margin.left + margin.right}
              height={height + margin.top + margin.bottom}
              preserveAspectRatio="none"
              viewBox={
                determineViewBox
                  ? determineViewBox({ size, margin })
                  : `-10 0 ${size.width} ${size.height}`
              }
              ref={svg => (this.chart = svg)}
            >
              <Group left={margin.left}>
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
                        type,
                        orientation,
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
              {recursiveCloneChildren(children, {
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
                orientation,
                mouseMove: this.mouseMove,
                mouseLeave: this.mouseLeave,
                xKey,
                yKey,
                inheritedScale: yScale,
                formatY,
                numYTicks,
                formatX
              })}
              <Group left={margin.left}>
                {bar || (
                  <Bar
                    width={width}
                    height={height}
                    fill="transparent"
                    onMouseMove={() => event => {
                      notool ||
                        this.mouseMove({
                          event,
                          xPoints,
                          xScale,
                          yScale,
                          yScales:
                            biaxialChildren && createScalarData(data, dataKeys, height, margin),
                          dataKeys
                        })
                    }}
                    onTouchMove={() => event => {
                      notool ||
                        this.mouseMove({
                          event,
                          xPoints,
                          xScale,
                          yScale,
                          yScales:
                            biaxialChildren && createScalarData(data, dataKeys, height, margin),
                          dataKeys
                        })
                    }}
                    onTouchEnd={() => this.mouseLeave}
                    onMouseLeave={() => this.mouseLeave}
                  />
                )}
              </Group>
              {glyphRenderer && glyphRenderer({ width, height, xScale, yScale, margin })}
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
  axes: ({ x: AxisProps, y: AxisProps }) => { x: $Shape<AxisProps>, y: $Shape<AxisProps> },
  grid: GridProps,
  tooltip: ($Shape<TooltipData>) => $Shape<TooltipProps>,
  xKey?: string,
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
