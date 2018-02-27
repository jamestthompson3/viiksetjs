import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Line } from '@vx/shape'
import { withBoundingRects } from '@vx/bounds'
import { LinearGradient } from '@vx/gradient'
import { PatternLines } from '@vx/pattern'
import { GridRows } from '@vx/grid'
import { AreaClosed, LinePath } from '@vx/shape'
import { AxisBottom, AxisLeft } from '@vx/axis'
import { rgba } from 'polished'

const findStroke = p => p.theme[p.stroke] || p.stroke || p.theme.primaryColor
const findColor = p => p.theme[p.color] || p.color || p.theme.primaryColor

export const StyledGridRows = styled(GridRows).attrs({
  pointerEvents: 'none',
  width: p => p.width,
  stroke: p => findStroke(p)
})``
export const StyledLeftAxis = styled(AxisLeft).attrs({
  strokeWidth: 2,
  numTicks: p => p.numTicks,
  stroke: p => findColor(p),
  tickLabelProps: p => () => ({ fill: findColor(p), dx: '-2em' })
})``
export const StyledBottomAxis = styled(AxisBottom).attrs({
  top: p => p.height,
  numTicks: p => p.numTicks,
  stroke: p => findColor(p),
  tickLabelProps: p => () => ({
    fill: findColor(p),
    dy: '-0.25rem',
    fontWeight: '900',
    textAnchor: 'left',
    fontSize: 11
  })
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
  border: 2px solid ${p => (p.color ? p.color : p.theme.primaryColor)};
  border-radius: 5px;
  background: #1a2e3c;
  box-shadow: 6px 6px 27px -12px rgba(0, 0, 0, 0.75);
  padding: 8px;
  > * {
    margin: 0;
    font-size: 12px;
  }
`
export const Corner = styled.div`
  height: 16px;
  width: 16px;
  margin-top: -0.625rem;
  z-index: 110;
  border-right: 2px solid ${p => (p.color ? p.color : p.theme.primaryColor)};
  border-bottom: 2px solid ${p => (p.color ? p.color : p.theme.primaryColor)};
  border-right-bottom-radius: 5px;
  background: #1a2e3c;
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


const boundsSetter = ({ left, rect, parentRect }) => {
  if (left + rect.width > parentRect.width) {
    return left - rect.width
  } else if (left + rect.width < parentRect.left) {
    return left + (rect.width / 3)
  } else {
    return  left - (rect.width / 4) // default case
  }
}
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
