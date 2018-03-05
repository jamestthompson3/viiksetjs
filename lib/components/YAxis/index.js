function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import React from 'react';
import { scaleLinear } from 'd3-scale';
import { StyledLeftAxis, StyledRightAxis } from '../styledComponents';

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
      numYTicks = _ref.numYTicks;

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
  return position === 'left' ? React.createElement(StyledLeftAxis, {
    scale: yScale,
    left: margin.left,
    label: label,
    labelProps: labelProps,
    color: color,
    numTicks: numYTicks,
    hideTicks: true,
    tickLabelProps: function tickLabelProps() {
      return { fill: color, dx: '-2em', fontSize: 12 };
    },
    tickFormat: formatY
  }) : React.createElement(StyledRightAxis, {
    scale: yScale,
    left: width,
    label: label,
    labelProps: labelProps,
    color: color,
    numTicks: numYTicks,
    hideTicks: true,
    tickLabelProps: function tickLabelProps() {
      return { fill: color, fontSize: 12 };
    },
    tickFormat: formatY
  });
};

YAxis.defaultProps = {
  labelProps: { fontSize: 12, textAnchor: 'middle', fill: 'black', y: -20 }
};

export default YAxis;