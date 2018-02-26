var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Fragment, Component } from 'react';
import { scaleLinear } from 'd3-scale';
import { curveMonotoneX } from '@vx/curve';
import moment from 'moment';
import PropTypes from 'prop-types';
import { flatten } from 'lodash';

import { StyledGradient, StyledPatternLines, StyledLinePath, StyledAreaClosed } from '../styledComponents';

var LineChart = function (_Component) {
  _inherits(LineChart, _Component);

  function LineChart() {
    _classCallCheck(this, LineChart);

    return _possibleConstructorReturn(this, (LineChart.__proto__ || Object.getPrototypeOf(LineChart)).apply(this, arguments));
  }

  _createClass(LineChart, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(prevProps) {
      return !(this.props.yPoints === prevProps.yPoints) || !(prevProps.dataKey === this.props.dataKey);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          data = _props.data,
          color = _props.color,
          dataKey = _props.dataKey,
          xScale = _props.xScale,
          xKey = _props.xKey,
          nofill = _props.nofill,
          height = _props.height,
          margin = _props.margin,
          nopattern = _props.nopattern,
          inheritedScale = _props.inheritedScale,
          axisId = _props.axisId;
      // Check if data exists

      if (data.map(function (item) {
        return item[dataKey];
      }).includes(undefined)) {
        new ReferenceError('LineChart: No data found with dataKey ' + dataKey);
        return null;
      }
      if (axisId && data.map(function (item) {
        return item[axisId];
      }).includes(undefined)) {
        new ReferenceError('LineChart: No data found with axisId ' + axisId);
        return null;
      }
      var yPoints = function yPoints(d) {
        return d[dataKey];
      };
      var xPoints = function xPoints(d) {
        return xKey ? d[xKey] : flatten(Object.values(d).map(function (value) {
          if (typeof value === 'string') {
            return moment(value);
          }
        })).filter(function (i) {
          return i != null;
        })[0];
      };
      var dataPoints = data.map(function (item) {
        return item[dataKey];
      });
      var yScale = scaleLinear().domain([0, Math.max.apply(Math, _toConsumableArray(dataPoints))]).range([height, margin.top + margin.top]);
      var getAxis = function getAxis() {
        return axisId == null ? inheritedScale : yScale;
      };
      var findFill = function findFill(gradient) {
        if (nofill) {
          return;
        }
        return gradient ? 'url(#gradient' + dataKey + ')' : 'url(#dlines' + dataKey + ')';
      };
      return React.createElement(
        Fragment,
        null,
        !nofill && React.createElement(
          Fragment,
          null,
          React.createElement(StyledGradient, _extends({ color: color }, { id: 'gradient' + dataKey })),
          React.createElement(StyledPatternLines, _extends({ color: color }, { id: 'dlines' + dataKey }))
        ),
        React.createElement(StyledLinePath, _extends({ data: data, color: color }, {
          y: yPoints,
          x: xPoints,
          yScale: getAxis(),
          xScale: xScale,
          curve: curveMonotoneX
        })),
        !nofill && React.createElement(StyledAreaClosed, _extends({ data: data, color: color }, {
          y: yPoints,
          x: xPoints,
          fill: findFill('gradient'),
          yScale: getAxis(),
          xScale: xScale,
          curve: curveMonotoneX
        })),
        !nopattern || !nofill && React.createElement(StyledAreaClosed, _extends({ data: data, color: color }, {
          y: yPoints,
          yScale: getAxis(),
          xScale: xScale,
          fill: findFill(),
          x: xPoints,
          curve: curveMonotoneX
        }))
      );
    }
  }]);

  return LineChart;
}(Component);

LineChart.propTypes = {
  /**
   * Specifies which data points the chart should use to draw itself
   **/
  dataKey: PropTypes.string.isRequired,
  /**
   * Optional color prop
   **/
  color: PropTypes.string,
  /**
   * If true, there will be no fill on the line chart.
   **/
  nofill: PropTypes.bool,
  /**
   * If true, there will be no patter on the line chart.
   */
  nopattern: PropTypes.bool
};

LineChart.defaultProps = {
  color: 'rgb(0, 157, 253)',
  nofill: false,
  nopattern: false
};
export default LineChart;