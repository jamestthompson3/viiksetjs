import { ReactNode } from 'react';
import { ScaleFunction, Margin, Size } from '@viiksetjs/utils';

export interface GenericData {
  [key: string]: any;
}

export type GenericGetter = (d: GenericData) => any;

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

interface GlyphRendererProps {
  width: number;
  height: number;
  xScale: ScaleFunction;
  yScale: ScaleFunction;
  margin: Margin;
}

export type GlyphRenderer = (props: GlyphRendererProps) => ReactNode;

type GridProps = {
  type: 'mesh' | 'horizontal' | 'vertical';
  stroke: string;
};

// TODO Break this guy up, more composable?
export interface RenderContainerProps {
  x: number;
  children: ReactNode;
  yKey?: string;
  size: Size;
  color: string;
  orientation?: 'horizontal';
  xKey?: string;
  glyphRenderer?: GlyphRenderer;
  determineViewBox({ size, margin }: { size: Size; margin: Margin }): string;
  type: 'ordinal' | 'linear';
  noGrid: boolean;
  margin: Margin;
  axes: Axis;
  grid: GridProps;
  gridStroke: string;
  stroke: string | number;
}

export interface RenderedChildProps {
  dataKey: string;
  axisId?: string;
  type?: string;
  color: string | ((arg: any) => string);
  height: number;
  width: number;
  margin: Margin;
  yPoints: number[];
  data: Object[];
  xScale: ScaleFunction;
  inheritedScale: ScaleFunction;
  xKey: string;
}

export interface Size {
  width: number;
  height: number;
}

export interface Tooltip<T> {
  calculatedData?: T;
  tooltipData?: T;
  tooltipContent(content: Object): ReactNode;
  x?: number;
  mouseX: number;
  mouseY: number;
  showTooltip: boolean;
  yCoords?: number[];
  stroke: string;
  color: string | ((arg: any) => string);
  height: number;
}

export interface BarChartProps {
  type: string;
  orientation: string;
  yPoints: any[];
  margin: Margin;
  xKey: string;
  declareBar(): void;
  mouseMove(args: any): void;
  noTool: boolean;
  height: number;
  nofill: boolean;
  mouseLeave(): void;
  yKey: string;
  width: number;
  barProps: Object;
  xPoints: any[];
}

type StreamParser = (data: any[], message: any) => any[];

export interface FromStreamArgs {
  message: any;
  persist: number;
  mapStream: StreamParser;
}
