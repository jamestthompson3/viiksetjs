import * as React from 'react';
import { BarChartProps } from 'typedef';
export declare const StackedBar: React.FunctionComponent<Props>;
interface Props extends Partial<BarChartProps> {
  colors: string[];
  keys: string[];
}
declare const _default: React.NamedExoticComponent<Props>;
export default _default;
