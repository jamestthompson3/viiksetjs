import * as React from 'react';
import { ScaleFunction } from '@viiksetjs/utils';
import { BarChartProps } from 'typedef';
export declare const BarChart: React.FunctionComponent<Props>;
interface Props extends Partial<BarChartProps> {
  dataKey: string;
  inheritedScale?: ScaleFunction;
  nofill?: boolean;
  axisId?: string;
  inverted?: boolean;
  color?: string;
}
declare const _default: React.NamedExoticComponent<Props>;
export default _default;
