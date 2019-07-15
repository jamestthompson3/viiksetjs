import * as React from 'react'
import merge from 'lodash/merge'

import { StyledLeftAxis, StyledBottomAxis, StyledGridRows } from '../styledComponents'

import { determineYScale } from '../../utils/chartUtils'
import { AxisProps, Margin, ScaleFunction, Axis } from '../.././types/index'

interface GridReturnProps {
  yScale: ScaleFunction
  width: number
  left: number
}

type Grid = (args: GridReturnProps) => React.ReactNode

interface LeftAxisReturnProps {
  type: string
  orientation: string
  height: number
  yPoints: number[] | string[]
  margin: Margin
}

export type LeftAxisReturn = (args: LeftAxisReturnProps) => React.ReactNode

interface BottomAxisReturnProps {
  margin: Margin
  height: number
  scale: ScaleFunction
}

export type BottomAxisReturn = (args: BottomAxisReturnProps) => React.ReactNode

export const buildLeftAxis = ({
  y,
  color
}: {
  y: Partial<AxisProps>
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
  x: Partial<AxisProps>
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

export function buildAxis(
  biaxialChildren: boolean,
  position: string,
  defaultAxes: Axis,
  axes: Axis,
  color: string
): BottomAxisReturn | LeftAxisReturn | null {
  const { y, x } = merge({}, defaultAxes, axes)

  if (position === 'left' && !biaxialChildren && axes.y !== null) {
    return buildLeftAxis({ y, color })
  }

  if (position === 'bottom' && axes.x !== null) {
    return buildBottomAxis({ x, color })
  }

  return () => null
}

export const buildGrid = (gridStroke: string, noGrid: boolean): Grid => {
  if (noGrid) return () => null
  return React.memo(function Grid({ yScale, width, left }) {
    return <StyledGridRows scale={yScale} stroke={gridStroke} width={width - left} />
  })
}
