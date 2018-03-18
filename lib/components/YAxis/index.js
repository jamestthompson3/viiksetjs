'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d3Scale = require('d3-scale');

var _styledComponents = require('../styledComponents');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var YAxis = function YAxis(_ref) {
  var height = _ref.height,
      data = _ref.data,
      axisId = _ref.axisId,
      color = _ref.color,
      position = _ref.position,
      width = _ref.width,
      formatY = _ref.formatY,
      margin = _ref.margin,
      label = _ref.label,
      labelProps = _ref.labelProps,
      numYTicks = _ref.numYTicks,
      tickLabels = _ref.tickLabels,
      rest = _objectWithoutProperties(_ref, ['height', 'data', 'axisId', 'color', 'position', 'width', 'formatY', 'margin', 'label', 'labelProps', 'numYTicks', 'tickLabels']);

  // Check if data exists
  if (data.map(function (item) {
    return item[axisId];
  }).includes(undefined)) {
    new ReferenceError('YAxis: No data found with axisId ' + axisId);
    return null;
  }
  var dataPoints = data.map(function (item) {
    return item[axisId];
  });
  var yScale = (0, _d3Scale.scaleLinear)().domain([0, Math.max.apply(Math, _toConsumableArray(dataPoints))]).range([height, margin.top]);
  return position === 'left' ? _react2.default.createElement(_styledComponents.StyledLeftAxis, _extends({ scale: yScale, label: label, labelProps: labelProps, color: color }, {
    left: margin.left,
    numTicks: numYTicks,
    hideTicks: true,
    tickFormat: formatY,
    tickLabels: tickLabels ? tickLabels : function () {
      return {
        dy: '-0.25rem',
        dx: '-1.75rem',
        strokeWidth: '0.5px',
        fontWeight: '400',
        textAnchor: 'left',
        fontSize: 12
      };
    }
  }, rest)) : _react2.default.createElement(_styledComponents.StyledRightAxis, _extends({ scale: yScale, label: label, labelProps: labelProps, color: color }, {
    left: width,
    numTicks: numYTicks,
    hideTicks: true,
    tickFormat: formatY,
    tickLabels: tickLabels ? tickLabels : function () {
      return {
        dy: '-0.25rem',
        dx: '0rem',
        strokeWidth: '0.5px',
        fontWeight: '400',
        textAnchor: 'left',
        fontSize: 12
      };
    }
  }, rest));
};

YAxis.defaultProps = {
  labelProps: { fontSize: 12, textAnchor: 'middle', fill: 'black' }
};

exports.default = YAxis;