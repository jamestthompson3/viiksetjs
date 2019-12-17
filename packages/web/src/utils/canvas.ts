// Control point and spline functions attributed to Rob Spencer at scaled innovation
// and his post on splining between points:
// http://scaledinnovation.com/analytics/splines/aboutSplines.html
import * as React from 'react';
import { rgba } from 'polished';

import { LineProps } from '../typedef';
export interface Point {
  x: number;
  y: number;
}

// Calculate control points between three given points
export function getControlPoints(
  previous: Point,
  current: Point,
  next: Point,
  tension: number
): [Point, Point] {
  const distancePrevCurrent = Math.sqrt(
    Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2)
  );
  const distanceCurrNext = Math.sqrt(
    Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2)
  );
  const scaleFactor0 =
    (tension * distancePrevCurrent) / (distancePrevCurrent + distanceCurrNext);
  const scaleFactor1 = tension - scaleFactor0;
  const controlPoint0 = {
    x: current.x + scaleFactor0 * (previous.x - next.x),
    y: current.y + scaleFactor0 * (previous.y - next.y),
  };
  const controlPoint1 = {
    x: current.x - scaleFactor1 * (previous.x - next.x),
    y: current.y - scaleFactor1 * (previous.y - next.y),
  };
  return [controlPoint0, controlPoint1];
}

export function drawPoint(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  color: string,
  opacity: number,
  radius: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.fillStyle = color;
  ctx.globalAlpha = opacity;
  ctx.arc(px, py, radius, 0.0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.restore();
}

type PointGetter = (i: number) => number;
export function drawBezierCurve(
  len: number,
  controlPoints: Point[],
  ctx: CanvasRenderingContext2D,
  getX: PointGetter,
  getY: PointGetter
) {
  // draw all curves except first and last
  for (let i = 2; i < len - 5; i += 2) {
    const cp1 = controlPoints[i - 2];
    const cp2 = controlPoints[i - 1];
    const x = getX(i + 2);
    const y = getY(i + 2);
    ctx.beginPath();
    ctx.moveTo(getX(i), getY(i));
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, x, y);
    ctx.stroke();
    ctx.closePath();
    drawPoint(ctx, cp1.x, cp1.y, 'red', 3, 0.75);
  }
  // Draw first and last curve
  ctx.beginPath();
  ctx.moveTo(getX(0), getY(0));
  ctx.quadraticCurveTo(
    controlPoints[0].x,
    controlPoints[0].y,
    getX(2),
    getY(2)
  );
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(getX(len - 2), getY(len - 2));
  // something strange with cp here...
  const cp1 = controlPoints[2 * len - 10];
  console.log(cp1);
  ctx.quadraticCurveTo(
    controlPoints[len - 10].x,
    controlPoints[len - 10].y,
    getX(len - 4),
    getY(len - 4)
  );
  ctx.stroke();
  ctx.closePath();
}

export function drawLine(
  len: number,
  ctx: CanvasRenderingContext2D,
  getX: PointGetter,
  getY: PointGetter,
  lineProps: Partial<LineProps> = {},
  nofill: boolean,
  color: string | string[],
  height: number,
  gradientOpacity?: number[]
) {
  ctx.save();
  if (lineProps.strokeDasharray) {
    ctx.setLineDash(lineProps.strokeDasharray);
  }

  ctx.beginPath();
  for (let i = 0; i < len; ++i) {
    const coords = {
      x: getX(i),
      y: getY(i),
    };
    if (i === 0) {
      ctx.moveTo(coords.x, coords.y);
    } else {
      ctx.lineTo(coords.x, coords.y);
    }
  }

  if (!nofill) {
    ctx.lineTo(getX(len - 1), height);
    ctx.lineTo(getX(0), height);
    ctx.stroke();
    const gradient = ctx.createLinearGradient(0, 0, 0, height);

    if (typeof color === 'string') {
      let gradients = [0, 0.5, 1];
      if (gradientOpacity && gradientOpacity.length > 0) {
        gradients = gradientOpacity.slice();
      }
      gradients.forEach((grad, i) => {
        gradient.addColorStop(i / gradients.length, rgba(color, grad));
      });
    } else {
      const stops = color.length;
      if (gradientOpacity) {
        if (gradientOpacity.length !== stops) {
          throw new Error(
            'Amount of custom gradient color stops must match amount of custom gradient opacity stops.'
          );
        }
        gradientOpacity.forEach((grad, i) => {
          gradient.addColorStop(i / stops, rgba(color[i], grad));
        });
      } else {
        color.forEach((color, i) => {
          gradient.addColorStop(i / stops, rgba(color, i / stops));
        });
      }
    }

    ctx.fillStyle = gradient;
    ctx.fill();
  } else {
    ctx.stroke();
  }
  ctx.restore();
}

type AcquireFn = () => HTMLCanvasElement;

export function useCanvasRef(acquireRef: AcquireFn) {
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement>();
  React.useEffect(() => {
    const parentCanvas = acquireRef();
    setCanvas(parentCanvas);
  }, []);
  return canvas;
}
