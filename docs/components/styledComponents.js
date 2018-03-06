import React from 'react'
import styled from 'styled-components'
import { withBounds } from '../../lib'
import { Line } from '@vx/shape'

export const PageWrapper = styled.div`
  width: 100%;
  background: #333;
  h2 {
    text-align: center;
  }
  h1 {
    text-align: center;
  }
  overflow-y: auto;
`

export const Wrapper = styled.div`
  margin: auto;
  padding-top: 2rem;
  padding-bottom: 2rem;
  background: #fff;
  width: 80%;
`

export const GraphContainer = styled.div`
  width: 90%;
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
  box-shadow: 6px 6px 27px -12px rgba(0, 0, 0, 0.75);
  border-bottom: 3px solid #00adee;
`
export const Snippet = styled.pre`
  background: #1b1b1b;
  color: white;
  border-radius: 3px;
  width: 80%;
  padding-top: 2rem;
  margin: auto;
  margin-top: 1rem;
  padding-bottom: 2rem;
  box-shadow: 6px 6px 27px -12px rgba(0, 0, 0, 0.75);
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
  border-radius: 3px;
  margin-right: 3px;
  background: ${p => p.color};
`

export const Label = styled.p`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${p => p.color};
`

const Container = styled.div.attrs({
  style: p => ({
    left: `${p.rect ? p.left - p.rect.width / 3 : p.left}px`,
    top: `${p.parentRect ? -(p.parentRect.height - 200) : p.yCoord}px`
  })
})`
  display: flex;
  flex-direction: column;
  position: absolute;
  justify-content: space-around;
  padding: 10px;
  align-items: center;
  box-shadow: 6px 6px 27px -12px rgba(0, 0, 0, 0.75);
  height: 100px;
  width: 100px;
  background: cornflowerblue;
  border-radius: 3px;
`
const BoundedContainer = withBounds(Container)
export const Indicator = ({ x, color, yCoords, height }) => (
  <Line
    from={{ x: x, y: height }}
    to={{ x: x, y: yCoords[1] + 8 }}
    stroke={color}
    strokeWidth={5}
    strokeOpacity={1.5}
    style={{ pointerEvents: 'none' }}
  />
)
const BoundedTooltip = withBounds(TooltipContainer)
export const LinearTooltip = ({ tooltipData, x, yCoords }) => (
  <BoundedTooltip left={x} yCoord={yCoords[1] - 15}>
    {tooltipData.y < 300 ? '❄️' : '🔥'}
  </BoundedTooltip>
)
export const BiaxialTooltip = ({ tooltipData, x, yCoords }) => (
  <BoundedContainer left={x - 10} yCoord={yCoords[1]}>
    <p>👩‍💻: {tooltipData.users}</p>
    <p>📝: {tooltipData.posts}</p>
  </BoundedContainer>
)
