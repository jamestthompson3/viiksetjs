import {
  ScaleContinuousNumeric,
  ScaleLinear,
  ScaleTime,
  ScaleBand,
  ScaleOrdinal,
} from 'd3-scale';

export type ScaleFunction<R, O> =
  | ScaleBand<R>
  | ScaleContinuousNumeric<R, O>
  | ScaleLinear<R, O>
  | ScaleTime<R, O>
  | ScaleOrdinal<R, O>;

export interface Margin {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface ScalarObject<R, O> {
  [key: string]: ScaleFunction<R, O>;
}

interface GenericNumericData {
  [key: string]: number;
}

interface ScaleProps {
  type: string;
  xPoints: number[] | string[] | Date[];
  yPoints: number[] | string[];
  width: number;
  invertedRange: boolean;
  height: number;
  orientation: string;
  margin: Margin;
}

export interface Size {
  width: number;
  height: number;
}

export interface MouseMove {
  event: React.SyntheticEvent;
  xPoints: number[] | string[];
  xScale: ScaleFunction<any, any>;
  yScale: ScaleFunction<any, any>;
  yScales: false | { [key: string]: ScaleFunction<any, any> };
  dataKeys: string[];
  datum?: Object;
}

export interface AxisProps {
  format(d: any, i: number): string;
  tickLabelProps(
    d: any,
    i: number
  ): {
    fontWeight: number;
    strokeWidth: number | string;
    textAnchor: string;
    fontSize: number | string;
  };
  tickFormat(d: any, i?: number): string | number;
  tickStroke: number | string;
  labelProps: Object;
  tickFormat(d: string | number, i?: number): string | number;
  label: string;
  numTicks: number;
  stroke: string;
}

export interface Axis {
  x: Partial<AxisProps>;
  y: Partial<AxisProps>;
}
