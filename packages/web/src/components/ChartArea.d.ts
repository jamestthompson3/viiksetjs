/// <reference types="modules" />
import * as React from 'react';
import {
  RenderContainerProps,
  GenericData,
  ToolTipData,
  RenderedWithTooltipProps,
} from '../typedef';
export declare function ChartArea({
  children,
  determineViewBox,
  data,
  xKey,
  yKey,
  type,
  size,
  noGrid,
  orientation,
  axes,
  stroke,
  tooltip,
  noTool,
  gridStroke,
  color,
  margin,
  glyphRenderer,
}: Props): JSX.Element | null;
export declare namespace ChartArea {
  var defaultProps: {
    data: never[];
    margin: any;
    axes: any;
    tooltip: TooltipProps<GenericData>;
    glyphRenderer: () => null;
  };
  var displayName: string;
  var __docgenInfo: {
    description: string;
    displayName: string;
    props: {};
  };
}
interface TooltipProps<T> {
  indicator(indicatorProps: RenderedWithTooltipProps): React.ReactElement;
  renderer(renderProps: RenderedWithTooltipProps): React.ReactNode;
  content(tooltipData: T): React.ReactNode;
  styles: {
    wrapper: Object;
    content: Object;
  };
}
interface Props extends RenderContainerProps {
  data: GenericData[];
  noTool: boolean;
  noGrid: boolean;
  calculatedData?: GenericData;
  tooltipData?: GenericData;
  tooltip: Partial<TooltipProps<ToolTipData>>;
}
declare const _default: React.FunctionComponent<any>;
export default _default;
