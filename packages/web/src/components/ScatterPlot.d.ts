import * as React from 'react';
import {
  GenericGetter,
  GenericData,
  RenderedChildPassedProps,
} from '../typedef';
export declare const ScatterPlot: React.FunctionComponent<Props>;
declare type NumGetter = (arg: GenericData) => number;
declare type StringGetter = (arg: GenericData) => string;
interface ScatterPlotProps extends RenderedChildPassedProps {
  radius: NumGetter | GenericGetter | number;
  color: StringGetter | GenericGetter | string;
  stroke: StringGetter | GenericGetter | string;
  borderWidth: NumGetter | GenericGetter | number;
  pointProps: number;
  opacity: NumGetter | GenericGetter | number;
}
declare type Props = Partial<ScatterPlotProps>;
declare const _default: React.NamedExoticComponent<Partial<ScatterPlotProps>>;
export default _default;
