// Control point and spline functions attributed to Rob Spencer at scaled innovation
// and his post on splining between points:
// http://scaledinnovation.com/analytics/splines/aboutSplines.html
export interface Point {
  x: number;
  y: number;
}

// Calculate control points between three given points
export function getControlPoints(
  previous: Point,
  current: Point,
  next: Point,
  smoothing: number
): [Point, Point] {
  const distancePrevCurrent = Math.sqrt(
    Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2)
  );
  const distanceCurrNext = Math.sqrt(
    Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2)
  );
  const scaleFactor0 =
    (smoothing * distancePrevCurrent) /
    (distancePrevCurrent + distanceCurrNext);
  const scaleFactor1 =
    (smoothing * distanceCurrNext) / (distancePrevCurrent + distanceCurrNext);
  const controlPoint0 = {
    x: current.x - scaleFactor0 * (next.x - previous.x),
    y: current.y - scaleFactor0 * (next.y - previous.y),
  };
  const controlPoint1 = {
    x: current.x + scaleFactor1 * (next.x - previous.x),
    y: current.y + scaleFactor1 * (next.y - previous.y),
  };
  return [controlPoint0, controlPoint1];
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
  ctx.beginPath();
  for (let i = 2; i < len - 5; i += 2) {
    const cp1 = controlPoints[i - 2];
    const cp2 = controlPoints[i - 1];
    const x = getX(i + 2);
    const y = getY(i + 2);
    ctx.moveTo(getX(i), getY(i));
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, x, y);
  }
  ctx.stroke();
  ctx.closePath();
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
  getY: PointGetter
) {
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
  ctx.stroke();
  ctx.closePath();
}
