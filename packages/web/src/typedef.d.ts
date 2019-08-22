import { ReactNode } from 'react';
import { ScaleFunction, Margin, Size, Axis } from '@viiksetjs/utils';

export interface GenericData {
  [key: string]: any;
}

export type ToolTipData = GenericData | null;

type ScaleType =
  | ScaleFunction<number, number>
  | ScaleFunction<number, Date>
  | ScaleFunction<number, string>;

export interface Scales {
  xScale: ScaleType;
  yScale: ScaleType;
}

export interface TooltipUpdateData {
  calculatedData: GenericData;
  x: number;
  mouseX: number;
  mouseY: number;
  yCoords: number[];
  showTooltip: boolean;
}

export type RenderedWithTooltipProps = Partial<Tooltip<ToolTipData>>;

export type GenericGetter = (d: GenericData) => any;

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
  stroke: string;
}

export interface RenderedChildPassedProps {
  dataKey: string;
  xPoints: any[];
  axisId: string;
  type: string;
  color: string | ((arg: any) => string);
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
  width: number;
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

export interface LineProps {
  strokeDasharray: [number, number];
  stroke: string;
  strokeWidth: number;
}

export interface FromStreamArgs {
  message: any;
  persist: number;
  mapStream: StreamParser;
}
