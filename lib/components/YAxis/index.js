function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import React from 'react';
import { scaleLinear } from 'd3-scale';
import { AxisRight, AxisLeft } from '@vx/axis';

var YAxis = function YAxis(_ref) {
  var height = _ref.height,
      data = _ref.data,
      axisId = _ref.axisId,
      color = _ref.color,
      position = _ref.position,
      width = _ref.width,
      formatter = _ref.formatter,
      margin = _ref.margin;

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
  var yScale = scaleLinear().domain([0, Math.max.apply(Math, _toConsumableArray(dataPoints))]).range([height, margin.top]);
  return position === 'left' ? React.createElement(AxisLeft, {
    scale: yScale,
    left: margin.left,
    numTicks: 4,
    stroke: color,
    strokeWidth: 2,
    hideTicks: true,
    tickLabelProps: function tickLabelProps() {
      return { fill: color, dx: '-2em' };
    },
    tickFormat: formatter
  }) : React.createElement(AxisRight, {
    scale: yScale,
    numTicks: 4,
    left: width,
    stroke: color,
    strokeWidth: 2,
    hideTicks: true,
    tickLabelProps: function tickLabelProps() {
      return { fill: color };
    },
    tickFormat: formatter
  });
};

export default YAxis;