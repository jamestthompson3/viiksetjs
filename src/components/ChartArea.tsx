import * as React from 'react'
import { Group } from '@vx/group'
import { Bar } from '@vx/shape'
import { bisect } from 'd3-array'
import flow from 'lodash/flow'
import head from 'lodash/head'
import get from 'lodash/get'
import merge from 'lodash/merge'

import { extractX, extractY, createScalarData } from '../utils/dataUtils'
import { formatTicks, formatXTicks } from '../utils/formatUtils'
import { localPoint, findTooltipX, recursiveCloneChildren, biaxial } from '../utils/chartUtils'
import { TooltipData, ScaleFunction, RenderContainerProps, Axis } from '../types/index'
import withTooltip from './Tooltip/withTooltip'
import withParentSize from './Responsive/withParentSize'
import {
  Indicator,
  defaultTooltipRenderer,
  defaultTooltipContent
} from './styledComponents'

import { buildAxis, BottomAxisReturn, LeftAxisReturn, buildGrid } from './common/index'
import { useChartData } from './DataContext/useChartData'

const DEFAULT_MARGIN = { top: 18, right: 15, bottom: 15, left: 30 }

const defaultAxes: Axis = {
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

function ChartArea<T>({
  children,
  determineViewBox,
  data,
  xKey,
  yKey,
  type,
  size,
  noGrid = false,
  orientation,
  axes,
  stroke,
  tooltip,
  updateTooltip,
  noTool = false,
  gridStroke,
  color,
  margin = DEFAULT_MARGIN,
  yCoords,
  calculatedData,
  glyphRenderer,
  mouseX,
  showTooltip,
  mouseY,
  x
}: Props<T>) {
  const chart = React.useRef(null)
  const [bar, setBar] = React.useState(false)
  const Grid = buildGrid(gridStroke, noGrid)
  // To prevent tooltips from not showing on bar chart due to minification changing names
  const declareBar = React.useCallback(() => setBar(true), [])

  const mouseMove = React.useCallback(
    ({ event, xPoints, xScale, yScale, yScales, dataKeys, datum }: MouseMove) => {
      if (tooltip === null || noTool) return

      const svgPoint = localPoint(chart, event)
      const mouseX = get(svgPoint, 'x')
      const mouseY = get(svgPoint, 'y')

      // Case for data contained in bar / pie charts:
      // there won't be an associated value based on precise
      // cursor position
      if (datum) {
        return updateTooltip({
          calculatedData: datum as T,
          x: mouseX,
          mouseX,
          mouseY,
          showTooltip: true
        })
      }

      const xValueOffset = biaxial(children) ? 0 : margin.right
      const xValue = xScale.invert(get(svgPoint, 'x') - xValueOffset)

      return flow(
        (xValue: number) => bisect(xPoints as number[], xValue),
        (index: number) => {
          // Find the closest data point based on the actual mouse position
          const bounds = { dLeft: data[index - 1], dRight: data[index] }
          // If the calculated xValue minus the value to the left is greater than
          // The indexed value minuse the calcuated value, take the right hand
          // value if available. If not, take the left hand value if available.
          return xValue - (xPoints[index - 1] as number) > (xPoints[index] as number) - xValue
            ? bounds.dRight || bounds.dLeft
            : bounds.dLeft || bounds.dRight
        },
        (calculatedData: T) => {
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
    },
    []
  )

  const mouseLeave = React.useCallback(() => {
      updateTooltip({ calculatedData: null, x: null, yCoords: null, showTooltip: false })
    }, [])

  const biaxialChildren = children && biaxial(children)
  const LeftAxis = buildAxis(biaxialChildren, 'left', defaultAxes, axes, color) as LeftAxisReturn
  const BottomAxis = buildAxis(biaxialChildren, 'bottom', defaultAxes, axes, color) as BottomAxisReturn
  const {
    indicator: Indicator,
    renderer: tooltipRenderer,
    styles: tooltipStyles,
    content: tooltipContent
  } = merge({}, defaultTooltip, tooltip)
  const { xScale, dataKeys, width, height, yPoints, xPoints, yScale } = useChartData({
    data,
    size,
    xKey,
    yKey,
    margin,
    type,
    orientation
  })
  return (
    <div style={{ width: size.width, height: size.height }} id="viiksetjsWrapperDiv">
      <svg
        width={size.width}
        height={size.height}
        preserveAspectRatio="none"
        viewBox={
          determineViewBox
            ? determineViewBox({ size, margin })
            : `-10 0 ${size.width} ${size.height}`
        }
        ref={chart}
      >
        <Group left={biaxialChildren ? 0 : margin.right}>
          <Group left={margin.left}>
            <Grid yScale={yScale} width={width} left={margin.left} />
            <LeftAxis {...{ type, orientation, yPoints, height, margin }} />
          </Group>
          {recursiveCloneChildren(children, {
            data,
            xScale,
            margin,
            height,
            noTool,
            axes,
            yPoints,
            xPoints,
            width,
            declareBar,
            type,
            orientation,
            mouseMove,
            mouseLeave,
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
              onMouseMove={(event: React.SyntheticEvent) =>
                mouseMove({
                  event,
                  xPoints,
                  xScale,
                  yScale,
                  yScales: biaxialChildren && createScalarData(data, dataKeys, height, margin),
                  dataKeys
                })
              }
              onTouchMove={(event: React.SyntheticEvent) =>
                mouseMove({
                  event,
                  xPoints,
                  xScale,
                  yScale,
                  yScales: biaxialChildren && createScalarData(data, dataKeys, height, margin),
                  dataKeys
                })
              }
              onTouchEnd={mouseLeave}
              onMouseLeave={mouseLeave}
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
  )
}

ChartArea.defaultProps = {
  data: [],
  margin: DEFAULT_MARGIN,
  axes: defaultAxes,
  tooltip: defaultTooltip,
  glyphRenderer: () => null
}

interface MouseMove {
  event: React.SyntheticEvent;
  xPoints: number[] | string[];
  xScale: ScaleFunction;
  yScale: ScaleFunction;
  yScales: false | { [key: string]: ScaleFunction };
  dataKeys: string[];
  datum?: Object;
}

interface TooltipProps<T> {
  indicator(indicatorProps: Partial<TooltipData<T>>): React.ReactNode;
  renderer(renderProps: Partial<TooltipData<T>>): React.ReactNode;
  content(tooltipData: T): React.ReactNode;
  styles: {
    wrapper: Object,
    content: Object
  };
}

interface Props<T> extends RenderContainerProps {
  data: T[];
  noTool: boolean;
  noGrid: boolean;
  calculatedData?: T;
  yCoords?: number[];
  mouseX?: number;
  mouseY?: number;
  tooltipData?: T;
  showTooltip: boolean;
  tooltip: Partial<TooltipProps<T>>;
  updateTooltip(tooltipData: Partial<TooltipData<T>>): void;
}

export default withTooltip(withParentSize(ChartArea))
