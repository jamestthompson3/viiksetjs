import React, { Fragment } from 'react'
import styled from 'styled-components'
import { get } from 'lodash'
import { withBoundingRects } from '@vx/bounds'
import { LinearGradient } from '@vx/gradient'
import { PatternLines } from '@vx/pattern'
import { GridRows } from '@vx/grid'
import { AreaClosed, LinePath, Bar, Line } from '@vx/shape'
import { AxisBottom, AxisLeft, AxisRight } from '@vx/axis'
import { rgba } from 'polished'

const findStroke = p => p.theme[p.stroke] || p.stroke || p.theme.primaryColor
const findColor = p => p.theme[p.color] || p.color || p.theme.primaryColor
const findFill = p => p.theme[p.color] || p.color || p.theme.primaryColor
const propsColorSetter = (func, p) => {
  const exec = func()
  switch (true) {
    case get(p, 'color') != null:
      return () => ({ ...exec, stroke: findColor(p), fill: findColor(p) })
    case get(p, 'stroke') != null:
      return () => ({ ...exec, stroke: findStroke(p), fill: findStroke(p) })
    default:
      return () => ({ ...exec, stroke: findColor(p), fill: findColor(p) })
  }
}

// FIXME SHOULD BE FOLDED INTO propsColorSetter
const colorSetter = (formatProps, p) => {
  switch (true) {
    case get(formatProps, 'color') != null:
      return { ...formatProps, stroke: findColor(p), fill: findColor(p) }
    case get(formatProps, 'stroke') != null:
      return { ...formatProps, stroke: findStroke(p), fill: findStroke(p) }
    default:
      return { ...formatProps, stroke: findColor(p), fill: findColor(p) }
  }
}
export const StyledPoint = styled.circle.attrs({
  cx: p => p.x,
  cy: p => p.y,
  stroke: p => findColor(p),
  strokeWidth: 1,
  fillOpacity: p => p.opacity,
  fill: p => findColor(p),
  r: p => p.radius
})``
export const StyledLine = styled(Line).attrs({
  from: p => p.from,
  to: p => p.to,
  stroke: p => findColor(p),
  strokeWidth: p => p.width,
  strokeDasharray: p => p.strokeDasharray
})``
export const StyledBar = styled(Bar).attrs({
  rx: 5,
  ry: 0,
  stroke: p => findColor(p),
  strokeWidth: 1
})``
export const StyledGridRows = styled(GridRows).attrs({
  pointerEvents: 'none',
  width: p => p.width,
  stroke: p => findStroke(p)
})``
export const StyledLeftAxis = styled(AxisLeft).attrs({
  strokeWidth: 2,
  numTicks: p => p.numTicks,
  stroke: p => findColor(p),
  tickLabelProps: p => propsColorSetter(p.tickLabels, p),
  labelProps: p => colorSetter(p.labelProps, p)
})``
export const StyledRightAxis = styled(AxisRight).attrs({
  strokeWidth: 2,
  numTicks: p => p.numTicks,
  stroke: p => findColor(p),
  tickLabelProps: p => propsColorSetter(p.tickLabels, p),
  labelProps: p => colorSetter(p.labelProps, p)
})``
export const StyledBottomAxis = styled(AxisBottom).attrs({
  top: p => p.height,
  numTicks: p => p.numTicks,
  stroke: p => findColor(p),
  tickLabelProps: p => propsColorSetter(p.tickLabels, p),
  labelProps: p => colorSetter(p.labelProps, p)
})``
export const StyledGradient = styled(LinearGradient).attrs({
  from: p => rgba(findColor(p), 0.35),
  to: p => rgba(findColor(p), 0.05)
})``
export const StyledPatternLines = styled(PatternLines).attrs({
  stroke: p => rgba(findColor(p), 0.15),
  strokeWidth: 1,
  width: 6,
  height: 6,
  orientation: ['diagonal']
})``
export const StyledLinePath = styled(LinePath).attrs({
  data: p => p.data,
  stroke: p => findColor(p),
  strokeWidth: '1.5px'
})``
export const StyledAreaClosed = styled(AreaClosed).attrs({
  data: p => p.data,
  stroke: p => findColor(p),
  strokeWidth: 1
})``

export const TooltipWrapper = styled.div`
  display: block;
  color: #fff;
  width: 125px;
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
  style: ({ bounds }) => ({
    left: `${bounds.left}px`,
    top: `${bounds.top}px`
  })
})`
  display: inline-flex;
  position: relative;
  pointer-events: none;
  z-index: 10000;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`

const boundsSetter = ({ left, rect, parentRect }) => left - get(rect, 'width', 0) / 4
// if (left + rect.width > parentRect.width) {
//   return left - rect.width / 3 // case for shifting to the right
// } else if (left + rect.width < parentRect.left) {
//   return left + rect.width / 6 // case for shifting to the left
// } else {
//   return left - rect.width / 4 // default case
// }
const TooltipBucket = ({ children, getRects, left }) => {
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

const BoundedTooltip = withBoundingRects(TooltipBucket)

export const withBounds = component => withBoundingRects(component)

export const TooltipComponent = ({ tooltipData, color, x }) => {
  return (
    <BoundedTooltip left={x}>
      <TooltipWrapper color={color}>
        {Object.entries(tooltipData).map((entry, i) => <p key={i}>{`${entry[0]}: ${entry[1]}`}</p>)}
      </TooltipWrapper>
    </BoundedTooltip>
  )
}

export const Indicator = ({ yCoords, x, stroke, color }) => (
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
