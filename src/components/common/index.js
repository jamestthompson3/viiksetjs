import * as React from 'react'

import { StyledLeftAxis, StyledBottomAxis } from '../styledComponents'
import { determineYScale } from '../../utils/chartUtils'

export const buildLeftAxis = ({ y, color }) =>
  React.memo(function LeftAxis({ type, orientation, yPoints, height, margin }) {
    const { label, numTicks, tickLabelProps, tickFormat, labelProps, ...rest } = y
    const scale = determineYScale({
      type,
      orientation,
      yPoints,
      height,
      margin
    })
    return (
      <StyledLeftAxis
        scale={scale}
        {...{
          color,
          numTicks,
          tickLabelProps,
          tickFormat,
          label,
          labelProps,
          ...rest
        }}
      />
    )
  })

export const buildBottomAxis = ({ x, color }) =>
  React.memo(function BottomAxis({ height, margin, scale }) {
    const { label, numTicks, tickLabelProps, tickFormat, labelProps, ...rest } = x
    return (
      <StyledBottomAxis
        {...{
          color,
          height,
          scale,
          margin,
          numTicks,
          tickLabelProps,
          tickFormat,
          label,
          labelProps,
          ...rest
        }}
      />
    )
  })
