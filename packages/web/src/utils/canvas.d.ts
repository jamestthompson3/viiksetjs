import { LineProps } from '../typedef';
export interface Point {
  x: number;
  y: number;
}
export declare function getControlPoints(
  previous: Point,
  current: Point,
  next: Point,
  tension: number
): [Point, Point];
export declare function drawPoint(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  color: string,
  stroke: string,
  borderWidth: number,
  opacity: number,
  radius: number
): void;
declare type PointGetter = (i: number) => number;
export declare function drawBezierCurve(
  len: number,
  controlPoints: Point[],
  ctx: CanvasRenderingContext2D,
  getX: PointGetter,
  getY: PointGetter
): void;
export declare function drawLine(
  len: number,
  ctx: CanvasRenderingContext2D,
  getX: PointGetter,
  getY: PointGetter,
  lineProps: Partial<LineProps> | undefined,
  nofill: boolean,
  color: string | string[],
  height: number,
  gradientOpacity?: number[]
): void;
declare type AcquireFn = () => HTMLCanvasElement;
export declare function useCanvasRef(
  acquireRef: AcquireFn
): HTMLCanvasElement | undefined;
export declare namespace useCanvasRef {
  var displayName: string;
  var __docgenInfo: {
    description: string;
    displayName: string;
    props: {};
  };
}
export {};
