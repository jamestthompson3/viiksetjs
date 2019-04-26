import * as React from 'react'

import { StyledLeftAxis, StyledBottomAxis } from '../styledComponents/index'
import { determineYScale } from '../../utils/chartUtils'
import { AxisProps, Margin, ScaleFunction } from '../.././types/index'

interface LeftAxisReturnProps {
  type: string;
  orientation: string;
  height: number;
  yPoints: number[] | string[];
  margin: Margin;
}

export type LeftAxisReturn = (args: LeftAxisReturnProps) => React.ReactNode

interface BottomAxisReturnProps {
  margin: Margin;
  height: number;
  scale: ScaleFunction;
}

export type BottomAxisReturn = (args: BottomAxisReturnProps) => React.ReactNode

export const buildLeftAxis = ({
  y,
  color
}: {
  y: Partial<AxisProps>,
  color: string
}): LeftAxisReturn =>
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

export const buildBottomAxis = ({
  x,
  color
}: {
  x: Partial<AxisProps>,
  color: string
}): BottomAxisReturn =>
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
