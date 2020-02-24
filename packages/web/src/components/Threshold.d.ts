import * as React from 'react';
import { RenderedChildPassedProps } from '../typedef';
import { InheritedChartProps } from '@viiksetjs/utils';
export declare const Threshold: React.FunctionComponent<Props>;
interface ThresholdProps extends RenderedChildPassedProps {
  y0: string;
  y1: string;
  aboveAreaProps: Object;
  belowAreaProps: Object;
  clipBelowTo: number;
  clipAboveTo: number;
  lineProps: Object;
}
declare type Props = Partial<ThresholdProps> & Readonly<InheritedChartProps>;
declare const _default: React.NamedExoticComponent<any>;
export default _default;
