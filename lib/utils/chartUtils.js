'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.barChart = exports.biaxial = exports.determineViewBox = exports.determineYScale = exports.determineXScale = undefined;
exports.localPoint = localPoint;

var _react = require('react');

var _point = require('@vx/point');

var _d3Scale = require('d3-scale');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var determineXScale = exports.determineXScale = function determineXScale(_ref) {
  var type = _ref.type,
      xPoints = _ref.xPoints,
      width = _ref.width,
      margin = _ref.margin;

  var range = [margin.left, width];
  switch (type) {
    case 'ordinal':
      return (0, _d3Scale.scaleBand)().domain(xPoints).range(range).padding(0.1);
    case 'linear':
      return (0, _d3Scale.scaleLinear)().domain([xPoints[0], xPoints[xPoints.length - 1]]).range(range);
    case 'horizontal':
      return (0, _d3Scale.scaleLinear)().domain([0, Math.max.apply(Math, _toConsumableArray(xPoints))]).range(range);
    default:
      return (0, _d3Scale.scaleTime)().domain([xPoints[0], xPoints[xPoints.length - 1]]).range(range);
  }
};

var determineYScale = exports.determineYScale = function determineYScale(_ref2) {
  var type = _ref2.type,
      yPoints = _ref2.yPoints,
      height = _ref2.height,
      margin = _ref2.margin;

  var range = [height, margin.top];
  switch (type) {
    case 'ordinal':
      return (0, _d3Scale.scaleLinear)().domain([Math.max.apply(Math, _toConsumableArray(yPoints)), 0]).range(range);
    case 'horizontal':
      return (0, _d3Scale.scaleBand)().domain(yPoints).range(range);
    default:
      return (0, _d3Scale.scaleLinear)().domain([0, Math.max.apply(Math, _toConsumableArray(yPoints))]).range(range);
  }
};

/**
 * Determines the viewbox of the chart container based on chart type and manual override
 * @param {String} viewBox - Optional prop passed to chartArea if custom viewbox is wanted
 * @param {Bool} biaxialChildren - Bool based on whether or not the chart has biaxial children
 * @param {Object} margin - Margin object
 * @param {Int} width - Width of parent container
 * @param {Int} height - Height of parent container
 */

var determineViewBox = exports.determineViewBox = function determineViewBox(biaxialChildren, margin, width, height) {
  return biaxialChildren ? '-10 0 ' + width + ' ' + height : -margin.left + ' 0 ' + width + ' ' + height;
};

/**
 * Takes React Chilren and returns true or false if unique axis Id is found
 * @param {Object} Children - React Children through which it maps
 */
var biaxial = exports.biaxial = function biaxial(children) {
  return children && _react.Children.map(children, function (child) {
    return child.props.hasOwnProperty('axisId');
  }).includes(true);
};

/**
 * Takes React Chilren and returns true or false if BarChart element is found
 * @param {Object} Children - React Children through which it maps
 */
var barChart = exports.barChart = function barChart(children) {
  return children && _react.Children.map(children, function (child) {
    return child.type.name === 'BarChart';
  }).includes(true);
};
/**
 * Own implementation of localPoint from VX. Makes it work on Firefox
 * @param {event} event - Event from which to extract svg canvas points
 * @param {node} node - Node from which to base bounding rects on
 */
function localPoint(node, event) {
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
    return new _point.Point({
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

  return new _point.Point({
    x: point.x,
    y: point.y
  });
}