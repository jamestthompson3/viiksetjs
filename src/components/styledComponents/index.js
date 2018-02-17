import React from 'react'
import styled from 'styled-components'
import { zip } from 'lodash'

import { extractY, parseObject } from 'common/vx/utils/dataUtils'

const TooltipWrapper = styled.div`
  display: block;
  border: 2px solid ${p => p.theme[p.color] || p.color || p.theme.primaryColor};
  border-radius: 5px;
  background: #1a2e3c;
  padding: 8px;
  > * {
    margin: 0;
  }
`

const Corner = styled.div`
  height: 16px;
  width: 16px;
  margin-top: -0.625rem;
  z-index: 110;
  border-right: 2px solid ${p => p.theme[p.color] || p.color || p.theme.primaryColor};
  border-bottom: 2px solid ${p => p.theme[p.color] || p.color || p.theme.primaryColor};
  border-right-bottom-radius: 5px;
  background: #1a2e3c;
  transform: rotate(45deg);
`

const TooltipContainer = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: ${p => `${p.left - 8.25}px`};
  pointer-events: none;
  z-index: 1000;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`

export const TooltipComponent = ({ tooltipData, color, left }) => {
  const values = extractY(tooltipData)
  const labels = parseObject(tooltipData, 'string')
  const displayValues = zip([values, labels])
  return (
    <TooltipContainer left={left}>
      <TooltipWrapper color={color}>
        {displayValues.map(([value, label]) => <p key={value}>{`${label}: ${value}`}</p>)}
      </TooltipWrapper>
      <Corner color={color} left={left} />
    </TooltipContainer>
  )
}
