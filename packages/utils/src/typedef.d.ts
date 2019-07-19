import {
  ScaleContinuousNumeric,
  ScaleLinear,
  ScaleTime,
  ScaleOrdinal,
} from 'd3-scale';

export type ScaleFunction<R, O> =
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
