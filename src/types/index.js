// @flow
export type Margin = {
  left: number,
  right: number,
  top: number,
  bottom: number
}

export type ScaleFunction = number => number

export type RenderedChildProps = {
  dataKey: string,
  axisId?: string,
  type?: string,
  color: string,
  height: number,
  width: number,
  margin: Margin,
  yPoints: number[],
  data: Object[],
  xScale: ScaleFunction,
  inheritedScale: ScaleFunction,
  xKey: string
}
