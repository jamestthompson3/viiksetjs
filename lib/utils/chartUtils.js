import { Children } from 'react';
import { Point } from '@vx/point';
import { scaleLinear, scaleTime, scaleBand } from 'd3-scale';

export var determineScale = function determineScale(_ref) {
  var type = _ref.type,
      xPoints = _ref.xPoints,
      width = _ref.width,
      margin = _ref.margin;

  var range = [margin.left, width];
  switch (type) {
    case 'ordinal':
      return scaleBand().domain(xPoints).range(range).padding(0.1);
    case 'linear':
      return scaleLinear().domain([xPoints[0], xPoints[xPoints.length - 1]]).range(range);
    default:
      return scaleTime().domain([xPoints[0], xPoints[xPoints.length - 1]]).range(range);
  }
};

/**
 * Determines the viewbox of the chart container based on chart type and manual override
 * @param {String} viewBox - Optional prop passed to chartArea if custom viewbox is wanted
 * @param {Bool} biaxialChildren - Bool based on whether or not the chart has biaxial children
 * @param {Object} margin - Margin object
 * @param {Int} parentWidth - Width of parent container
 * @param {Int} parentHeight - Height of parent container
 */

export var determineViewBox = function determineViewBox(_ref2) {
  var biaxialChildren = _ref2.biaxialChildren,
      margin = _ref2.margin,
      parentWidth = _ref2.parentWidth,
      parentHeight = _ref2.parentHeight;
  return biaxialChildren ? '-10 0 ' + parentWidth + ' ' + parentHeight : -margin.left + ' 0 ' + parentWidth + ' ' + parentHeight;
};

/**
 * Takes React Chilren and returns true or false if unique axis Id is found
 * @param {Object} Children - React Children through which it maps
 */
export var biaxial = function biaxial(children) {
  return Children.map(children, function (child) {
    return child.props.hasOwnProperty('axisId');
  }).includes(true);
};

/**
 * Own implementation of localPoint from VX. Makes it work on Firefox
 * @param {event} event - Event from which to extract svg canvas points
 * @param {node} node - Node from which to base bounding rects on
 */
export function localPoint(node, event) {
  // called with no args
  if (!node) return;

  // called with localPoint(event)
  if (node.target) {
    event = node;

    // set node to targets owner svg
    node = event.target.ownerSVGElement;

    // find the outermost svg
    while (node.ownerSVGElement) {
      node = node.ownerSVGElement;
    }
  }

  // default to mouse event
  var _event = event,
      clientX = _event.clientX,
      clientY = _event.clientY;

  // support touch event

  if (event.changedTouches) {
    clientX = event.changedTouches[0].clientX;
    clientY = event.changedTouches[0].clientY;
  }

  // FF workaround
  if (navigator.userAgent.includes('Firefox')) {
    var rect = node.getBoundingClientRect();
    return new Point({
      x: clientX - rect.left - node.clientLeft,
      y: clientY - rect.top - node.clientTop
    });
  }
  // calculate coordinates from svg
  node.createSVGPoint;
  var point = node.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  point = point.matrixTransform(node.getScreenCTM().inverse());

  return new Point({
    x: point.x,
    y: point.y
  });
}