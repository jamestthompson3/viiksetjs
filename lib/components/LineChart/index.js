var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Fragment, Component } from 'react';
import { LinearGradient } from '@vx/gradient';
import { scaleLinear } from 'd3-scale';
import { AreaClosed, LinePath } from '@vx/shape';
import { PatternLines } from '@vx/pattern';
import { curveMonotoneX } from '@vx/curve';
import moment from 'moment';
import PropTypes from 'prop-types';
import { rgba } from 'polished';
import { flatten } from 'lodash';

var LineChart = function (_Component) {
  _inherits(LineChart, _Component);

  function LineChart() {
    _classCallCheck(this, LineChart);

    return _possibleConstructorReturn(this, (LineChart.__proto__ || Object.getPrototypeOf(LineChart)).apply(this, arguments));
  }

  _createClass(LineChart, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(prevProps) {
      return !(this.props.yPoints === prevProps.yPoints);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          data = _props.data,
          color = _props.color,
          dataKey = _props.dataKey,
          xScale = _props.xScale,
          fill = _props.fill,
          height = _props.height,
          margin = _props.margin,
          pattern = _props.pattern,
          inheritedScale = _props.inheritedScale,
          axisId = _props.axisId,
          rest = _objectWithoutProperties(_props, ['data', 'color', 'dataKey', 'xScale', 'fill', 'height', 'margin', 'pattern', 'inheritedScale', 'axisId']);
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
        return flatten(Object.values(d).map(function (value) {
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
      return React.createElement(
        Fragment,
        null,
        pattern && React.createElement(
          Fragment,
          null,
          React.createElement(LinearGradient, {
            from: rgba(color, 0.35),
            to: rgba(color, 0.05),
            id: 'gradient' + dataKey
          }),
          React.createElement(PatternLines, {
            id: 'dlines' + dataKey,
            height: 6,
            width: 6,
            stroke: rgba(color, 0.15),
            strokeWidth: 1,
            orientation: ['diagonal']
          })
        ),
        axisId !== undefined ? React.createElement(LinePath, {
          data: data,
          xScale: xScale,
          yScale: yScale,
          x: xPoints,
          y: yPoints,
          curve: curveMonotoneX,
          stroke: color,
          strokeWidth: '1.5px'
        }) : React.createElement(LinePath, {
          data: data,
          xScale: xScale,
          yScale: inheritedScale,
          x: xPoints,
          y: yPoints,
          curve: curveMonotoneX,
          stroke: color,
          strokeWidth: '1.5px'
        }),
        fill && React.createElement(
          Fragment,
          null,
          axisId !== undefined ? React.createElement(
            Fragment,
            null,
            React.createElement(AreaClosed, {
              data: data,
              xScale: xScale,
              yScale: yScale,
              x: xPoints,
              y: yPoints,
              curve: curveMonotoneX,
              fill: fill ? 'url(#gradient' + dataKey + ')' : null,
              stroke: color,
              strokeWidth: 1
            }),
            React.createElement(AreaClosed, {
              data: data,
              xScale: xScale,
              yScale: yScale,
              x: xPoints,
              y: yPoints,
              curve: curveMonotoneX,
              fill: fill ? 'url(#dlines' + dataKey + ')' : null,
              stroke: color,
              strokeWidth: 1
            })
          ) : React.createElement(
            Fragment,
            null,
            React.createElement(AreaClosed, {
              data: data,
              xScale: xScale,
              yScale: inheritedScale,
              x: xPoints,
              y: yPoints,
              curve: curveMonotoneX,
              fill: fill ? 'url(#gradient' + dataKey + ')' : null,
              stroke: color,
              strokeWidth: 1
            }),
            React.createElement(AreaClosed, {
              data: data,
              xScale: xScale,
              yScale: inheritedScale,
              x: xPoints,
              y: yPoints,
              curve: curveMonotoneX,
              fill: fill ? 'url(#dlines' + dataKey + ')' : null,
              stroke: color,
              strokeWidth: 1
            })
          )
        )
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
   * Determines whether or not there should be a fill
   **/
  fill: PropTypes.bool,
  /**
   * Determines whether or not pattern lines should be present
   */
  pattern: PropTypes.bool
};

LineChart.defaultProps = {
  color: 'rgb(0, 157, 253)',
  fill: true,
  pattern: true
};
export default LineChart;