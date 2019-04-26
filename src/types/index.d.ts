export interface Margin {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface AxisProps {
  format(d: any, i: number): string;
  tickLabelProps(d: any, i: number): Function;
  labelProps: Object;
  tickFormat(d: any, i: number): Function;
  label: string;
  numTicks: number;
  stroke: string;
}

export type ScaleFunction = (num: number) => number

export interface RenderedChildProps {
  dataKey: string;
  axisId?: string;
  type?: string;
  color: string | ((arg: any) => string);
  height: number;
  width: number;
  margin: Margin;
  yPoints: number[];
  data: Object[];
  xScale: ScaleFunction;
  inheritedScale: ScaleFunction;
  xKey: string;
}
