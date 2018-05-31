import React, { Fragment } from 'react'
import styled, { withTheme } from 'styled-components'
import { get } from 'lodash'
import { withBoundingRects } from '@vx/bounds'
import { PatternLines } from '@vx/pattern'
import { LinearGradient } from '@vx/gradient'
import { GridRows } from '@vx/grid'
import { AreaClosed, LinePath, Bar, Line, Pie } from '@vx/shape'
import { AxisBottom, AxisLeft, AxisRight } from '@vx/axis'
import { Threshold } from '@vx/threshold'
import { rgba } from 'polished'

const findStroke = p => p.theme[p.stroke] || p.stroke || p.theme.primaryColor

export const findColor = p => p.theme[p.color] || p.color || p.theme.primaryColor

const findFill = p => p.theme[p.fill] || p.fill || p.theme.primaryColor

/**
 * Takes a function and returns the another function containing the correct props for axes
 * @param {Function} func - function that returns the current axis props
 * @param {Object} p - props object
 */
const propsColorSetter = (func, p, value, index) => {
  const exec = func(value, index)
  const combinedProps = { ...exec, ...p }
  const fill = get(combinedProps, 'fill') ? findFill(combinedProps) : findColor(combinedProps)
  return { ...exec, fill }
}

/**
 * Takes props from VX components and uses styled-component's theme to return the proper color
 * @param {Object} formatProps - props inherited from visualization component
 * @param {Object} p - props object
 */
const colorSetter = (formatProps, p) => {
  switch (true) {
    case get(formatProps, 'color') != null:
      return { ...formatProps, stroke: findColor(p), fill: findColor(p) }
    case get(formatProps, 'stroke') != null:
      return { ...formatProps, stroke: findStroke(p), fill: findStroke(p) }
    case get(formatProps, 'fill') != null:
      return { ...formatProps, stroke: findFill(p), fill: findFill(p) }
    default:
      return { ...formatProps, stroke: findColor(p), fill: findColor(p) }
  }
}

export const StyledText = withTheme(props => (
  <text {...{ ...props, fill: findFill(props) }} style={{ pointerEvents: 'none' }} />
))

export const StyledPoint = withTheme(props => (
  <circle
    {...{
      ...props,
      r: props.radius,
      stroke: findStroke(props),
      fillOpacity: props.opacity,
      fill: findColor(props)
    }}
  />
))

StyledPoint.defaultProps = {
  strokeWidth: 1
}

export const StyledLine = withTheme(props => (
  <Line {...{ ...props, strokeWidth: props.width, stroke: findStroke(props) }} />
))

export const StyledBar = withTheme(props => <Bar {...{ ...props, stroke: findColor(props) }} />)

StyledBar.defaultProps = {
  rx: 5,
  ry: 0
}

export const StyledGridRows = withTheme(props => (
  <GridRows {...{ ...props, stroke: findStroke(props) }} style={{ pointerEvents: 'none' }} />
))

export const StyledLeftAxis = withTheme(props => (
  <AxisLeft
    {...{
      ...props,
      stroke: findColor(props),
      tickLabelProps: (value, index) => propsColorSetter(props.tickLabelProps, props, value, index),
      labelProps: colorSetter(props.labelProps, props)
    }}
  />
))

StyledLeftAxis.defaultProps = {
  strokeWidth: 2
}

export const StyledRightAxis = withTheme(props => (
  <AxisRight
    {...{
      ...props,
      stroke: findColor(props),
      tickLabelProps: (value, index) => propsColorSetter(props.tickLabelProps, props, value, index),
      labelProps: colorSetter(props.labelProps, props)
    }}
  />
))

StyledRightAxis.defaultProps = {
  strokeWidth: 2
}

export const StyledBottomAxis = withTheme(props => (
  <AxisBottom
    {...{
      ...props,
      stroke: findColor(props),
      tickLabelProps: (value, index) => propsColorSetter(props.tickLabelProps, props, value, index),
      top: props.height,
      labelProps: colorSetter(props.labelProps, props)
    }}
  />
))

export const StyledPatternLines = withTheme(props => (
  <PatternLines {...{ ...props, stroke: rgba(findColor(props), props.opacity) }} />
))

StyledPatternLines.defaultProps = {
  opacity: 0.15,
  strokeWidth: 1,
  width: 6,
  height: 6,
  orientation: ['diagonal']
}

export const StyledGradient = withTheme(props => (
  <LinearGradient
    {...{
      ...props,
      from: rgba(findColor(props), props.start),
      to: rgba(findColor(props), props.end)
    }}
  />
))

StyledGradient.defaultProps = {
  start: 0.35,
  end: 0.05
}

export const StyledLinePath = withTheme(props => (
  <LinePath {...{ ...props, stroke: findColor(props) }} />
))

StyledLinePath.defaultProps = {
  strokeWidth: '1.5px'
}

export const StyledAreaClosed = withTheme(props => (
  <AreaClosed {...{ ...props, stroke: findColor(props) }} />
))

StyledAreaClosed.defaultProps = {
  strokeWidth: 1
}

export const StyledPie = withTheme(props => <Pie {...{ ...props, fill: findColor(props) }} />)

export const StyledThreshold = withTheme(props => (
  <Threshold
    {...{
      ...props,
      belowAreaProps: colorSetter(props.belowAreaProps, props),
      aboveAreaProps: colorSetter(props.aboveAreaProps, props)
    }}
  />
))

export const TooltipWrapper = styled.div`
  display: block;
  color: #fff;
  border: 2px solid ${p => p.color || p.theme.primaryColor};
  border-radius: 5px;
  background: #1a2e3c;
  box-shadow: 6px 6px 27px -12px rgba(0, 0, 0, 0.75);
  padding: 8px;
  > * {
    margin: 0;
    font-size: 12px;
  }
`
const TooltipContainer = styled.div.attrs({
  style: ({ bounds }) => {
    return {
      left: `${bounds.left}px`,
      top: `${bounds.top}px`
    }
  }
})`
  display: inline-flex;
  position: relative;
  pointer-events: none;
  z-index: 10000;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`

const boundsSetter = ({ left, rect, parentRect }) => {
  if (left + rect.width > parentRect.width) {
    return left - rect.width // case for shifting to the right
  } else if (rect.width / 3 == parentRect.left) {
    return rect.width // FIXME case for shifting to the left
  } else {
    return left - rect.width / 2.5 // default case
  }
}

/**
 * TooltipBounder sets bounds for the tooltip and passes them down
 * @param {ReactElement} children - children to be rendered
 * @param {Function} getRects - function for calcuating the bounding rects of the tooltip
 * @param {Number} left - x coordinate of the mouse
 */
const TooltipBounder = ({ children, getRects, left }) => {
  const { rect, parentRect } = getRects()
  const getBounds = () => {
    if (rect && parentRect) {
      return {
        left: boundsSetter({ left, rect, parentRect }),
        top: -parentRect.height - rect.height
      }
    }
    return {
      left: left,
      top: 0
    }
  }
  return <TooltipContainer bounds={getBounds()}>{children}</TooltipContainer>
}

const BoundedTooltip = withBoundingRects(TooltipBounder)

/**
 * Wraps a React component and passes the `getRects` function,
 * allowing the wrapped component to have access to both its own bounding rect
 * and the it's parent's bouding rect
 * @param {ReactElement} component
 */
export const withBounds = component => withBoundingRects(component)

/**
 * Wrapper component for default tooltip
 * @param {Object} tooltipData - data calculated from ChartArea
 * @param {String} color - color from ChartArea
 * @param {Number} x - svg x coordinate
 * @param {ReactElement} tooltipContent - prop passed from user
 */
export const defaultTooltipRenderer = ({ tooltipData, tooltipContent, color, x }) => (
  <BoundedTooltip left={x}>
    <TooltipWrapper color={color}>{tooltipContent({ tooltipData })}</TooltipWrapper>
  </BoundedTooltip>
)

/**
 * Default tooltip content function
 * @param {Object} tooltipData - tooltipData
 * @returns {ReactElement} tooltipContent
 */
export const defaultTooltipContent = ({ tooltipData }) =>
  Object.entries(tooltipData).map((entry, i) => <p key={i}>{`${entry[0]}: ${entry[1]}`}</p>)

export const Indicator = ({ yCoords, x, stroke, color }) => {
  return (
    <Fragment>
      <Line
        from={{ x: x, y: 0 }}
        to={{ x: x, y: Math.max(...yCoords) }}
        stroke={stroke}
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
  )
}
