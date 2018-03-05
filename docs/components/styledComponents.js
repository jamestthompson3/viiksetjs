import React from 'react'
import styled from 'styled-components'
import { withBounds } from '../../lib'
import { Line } from '@vx/shape'

export const PageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  h2 {
    text-align: center;
  }
  h1 {
    text-align: center;
  }
`

export const GraphContainer = styled.div`
  width: 80%;
  height: 20rem;
  margin: auto;
`

export const Header = styled.div`
  background: #00395e;
  display: flex;
  height: 100px;
  width: 100%;
  color: #fff;
  flex-direction: column;
  border-bottom: 3px solid #00adee;
`
export const Snippet = styled.pre`
  background: #333;
  color: white;
  width: 80%;
  padding-top: 2rem;
  margin: auto;
  padding-bottom: 2rem;
`
const TooltipContainer = styled.span.attrs({
  style: p => ({
    left: `${p.rect ? p.left + p.rect.width : p.left}px`,
    top: `${p.parentRect ? -(p.parentRect.height - p.yCoord + p.rect.height) : p.yCoord}px`
  })
})`
  position: relative;
  pointer-events: none;
`

export const LabelContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 85%;
  margin: auto;
`
export const LabelBlock = styled.span`
  width: 10px;
  height: 10px;
  margin-right: 3px;
  background: ${p => p.color};
`

export const Label = styled.p`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${p => p.color};
`

export const Indicator = ({ x, color, height }) => (
  <Line
    from={{ x: x - 2.5, y: 0 }}
    to={{ x: x - 2.5, y: height }}
    stroke={color}
    strokeWidth={5}
    strokeOpacity={1.5}
    style={{ pointerEvents: 'none' }}
  />
)
const BoundedTooltip = withBounds(TooltipContainer)
export const LinearTooltip = ({ tooltipData, x, yCoords }) => (
  <BoundedTooltip left={x} yCoord={yCoords[1]}>
    {tooltipData.y < 300 ? '❄️' : '🔥'}
  </BoundedTooltip>
)
