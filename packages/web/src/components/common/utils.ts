/**
 * Basically ripped out of Chart.js' helpers module:
 * https://github.com/chartjs/Chart.js/blob/master/src/helpers/helpers.canvas.js
 * https://github.com/chartjs/Chart.js/blob/master/src/core/core.helpers.js
 * Written by people much smarter than me...
 * */
export interface Point {
  x: number;
  y: number;
}

// Calculate control points between three given points
// Props to Rob Spencer at scaled innovation for his post on splining between points
// http://scaledinnovation.com/analytics/splines/aboutSplines.html
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
