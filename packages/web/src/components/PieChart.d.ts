import * as React from 'react';
import { ToolTipData, GenericData, RenderedChildPassedProps } from '../typedef';
import { InheritedChartProps } from '@viiksetjs/utils';
export declare const PieChart: React.FunctionComponent<Props>;
interface PieChartProps {
  labelKey: string;
  determineOpacity(arg: any): number;
  labelProps?: GenericData;
  tooltipRenderer?(arg: Partial<ToolTipData>): React.ReactNode;
  tooltipContent?(tooltipData: Object): React.ReactNode;
  innerRadius: number;
  outerRadius: number;
  pieProps: Object;
}
declare type Props = Partial<RenderedChildPassedProps> &
  PieChartProps &
  Readonly<InheritedChartProps>;
declare const _default: React.FunctionComponent<any>;
export default _default;
