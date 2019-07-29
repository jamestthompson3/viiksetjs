import * as React from 'react'
import styled from 'styled-components'
import { withBoundingRects } from '@vx/bounds'
import get from 'lodash/get'
import { Line } from '@vx/shape'

export const PageWrapper = styled.div`
  width: 100%;
  background: #333;
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow-x: hidden;
  h2 {
    text-align: center;
  }
  h1 {
    text-align: center;
    color: #fff;
  }
  overflow-y: auto;
`

export const Wrapper = styled.div`
  margin: auto;
  border-radius: 3px;
  padding: 2rem;
  background: #fff;
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  @media (max-width: 500px) {
    margin: 0;
    width: 100%;
    padding-left: 0;
    padding-right: 0;
  }
`

export const Selector = styled.h4`
  background: ${p => p.active && '#00395e'};
  padding: 10px;
  border-radius: 3px;
  margin: 0;
  cursor: pointer;
  text-align: center;
  color: ${p => (p.active ? '#fff' : '#000')};
  box-shadow: ${p => p.active && '0px 0px 0px 1px #49484f'};
`
export const FilterBox = styled.div`
  margin-top: 2rem;
  margin-bottom: 1rem;
  flex: 1 0 120px;
  height: 300px;
  max-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

export const ChartBox = styled.div`
  flex: 2 0 80%;
  max-width: 80%;
  @media (max-width: 500px) {
    width: 100%;
    max-width: 100%;
  }
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

const Code = styled.pre`
  background: #1b1b1b;
  color: white;
  overflow-x: auto;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 1rem;
  margin: auto;
  margin-top: 1rem;
  padding-bottom: 2rem;
  box-shadow: 6px 6px 27px -12px rgba(0, 0, 0, 0.75);
  @media (max-width: 500px) {
    height: 150px;
    padding: 1rem;
    overflow-y: auto;
  }
`

const CodeContainer = styled.div`
  width: 90%;
  padding: 10px;
`

export const Snippet = ({ children }) => (
  <CodeContainer>
    <Code>{children}</Code>
  </CodeContainer>
)

const TooltipContainer = styled.span.attrs(p => ({
  style: {
    left: `${p.rect ? p.left + p.rect.width : p.left}px`,
    top: `${p.parentRect ? -(p.parentRect.height - p.yCoord + p.rect.height) : p.yCoord}px`
  }
}))`
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

const Container = styled.div.attrs(p => ({
  style: {
    left: `${p.rect ? p.left - p.rect.width / 3 : p.left}px`,
    top: `${p.parentRect ? -(p.parentRect.height + p.rect.height) : p.yCoord}px`
  }
}))`
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: space-around;
  padding: 10px;
  align-items: center;
  box-shadow: 6px 6px 27px -12px rgba(0, 0, 0, 0.75);
  height: 100px;
  width: 100px;
  background: cornflowerblue;
  border-radius: 3px;
`
const BoundedContainer = withBoundingRects(Container)

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

const BoundedTooltip = withBoundingRects(TooltipContainer)

export const LinearTooltip = ({ tooltipData, x, yCoords }) => (
  <BoundedTooltip left={x} yCoord={get(yCoords, '[1]', 0) - 15}>
    {tooltipData.y < 300 ? <span role="img">❄️</span> : <span role="img">🔥</span>}
  </BoundedTooltip>
)
export const BiaxialTooltip = ({ tooltipData, x, yCoords }) => (
  <BoundedContainer left={x - 30} yCoord={get(yCoords, '[1]', 0)}>
    <p>
      <span role="img">👩‍💻</span>: {tooltipData.users}
    </p>
    <p>
      <span role="img">📝</span>: {tooltipData.posts}
    </p>
  </BoundedContainer>
)
