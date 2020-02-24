import * as React from 'react';
import { InheritedChartProps } from '@viiksetjs/utils';
import { LineProps, RenderedChildPassedProps } from '../typedef';
export declare const LineChart: React.FunctionComponent<Props>;
interface LineChartProps extends RenderedChildPassedProps {
  lineProps: LineProps;
  gradientOpacity: number[];
  nofill: boolean;
  canvas: HTMLCanvasElement;
  bezier: boolean;
}
declare type Props = LineChartProps & InheritedChartProps;
declare const _default: React.NamedExoticComponent<any>;
export default _default;
