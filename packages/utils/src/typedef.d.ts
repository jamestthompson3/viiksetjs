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
