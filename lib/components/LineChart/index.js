'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d3Scale = require('d3-scale');

var _lodash = require('lodash');

var _curve = require('@vx/curve');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('../styledComponents');

var _dataUtils = require('../../utils/dataUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LineChart = function (_Component) {
  _inherits(LineChart, _Component);

  function LineChart() {
    _classCallCheck(this, LineChart);

    return _possibleConstructorReturn(this, (LineChart.__proto__ || Object.getPrototypeOf(LineChart)).apply(this, arguments));
  }

  _createClass(LineChart, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(prevProps) {
      return this.props.yPoints !== prevProps.yPoints || prevProps.dataKey !== this.props.dataKey;
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
          solidfill = _props.solidfill,
          height = _props.height,
          margin = _props.margin,
          nopattern = _props.nopattern,
          inheritedScale = _props.inheritedScale,
          axisId = _props.axisId,
          areaProps = _props.areaProps,
          lineProps = _props.lineProps;

      // Check if data exists

      if (data.map(function (item) {
        return (0, _lodash.get)(item, dataKey);
      }).includes(undefined)) {
        // eslint-disable-next-line
        console.error('LineChart: No data found with dataKey ' + dataKey);
        return null;
      }

      if (axisId && data.map(function (item) {
        return (0, _lodash.get)(item, axisId);
      }).includes(undefined)) {
        // eslint-disable-next-line
        console.error('LineChart: No data found with axisId ' + axisId);
        return null;
      }

      var yPoints = function yPoints(d) {
        return (0, _lodash.get)(d, dataKey);
      };
      var xPoints = function xPoints(d) {
        return xKey ? (0, _lodash.get)(d, xKey) : new Date((0, _dataUtils.parseObject)(d, 'string', _dataUtils.checkMoment));
      };
      var dataPoints = data.map(function (item) {
        return (0, _lodash.get)(item, dataKey);
      });
      var yScale = (0, _d3Scale.scaleLinear)().domain([0, Math.max.apply(Math, _toConsumableArray(dataPoints))]).range([height, margin.top + margin.top]);
      var getAxis = function getAxis() {
        return axisId ? inheritedScale : yScale;
      };
      var findFill = function findFill(gradient) {
        return gradient ? 'url(#gradient' + dataKey + ')' : 'url(#dlines' + dataKey + ')';
      };

      return _react2.default.createElement(
        _react.Fragment,
        null,
        !nofill && _react2.default.createElement(
          _react.Fragment,
          null,
          _react2.default.createElement(_styledComponents.StyledGradient, { color: color, id: 'gradient' + dataKey }),
          _react2.default.createElement(_styledComponents.StyledPatternLines, { color: color, id: 'dlines' + dataKey })
        ),
        _react2.default.createElement(_styledComponents.StyledLinePath, _extends({ data: data, color: color }, {
          y: yPoints,
          x: xPoints,
          yScale: getAxis(),
          xScale: xScale,
          curve: _curve.curveMonotoneX
        }, lineProps)),
        !nofill && _react2.default.createElement(_styledComponents.StyledAreaClosed, _extends({ data: data, color: color }, {
          y: yPoints,
          x: xPoints,
          fill: solidfill ? (0, _styledComponents.findColor)(this.props) : findFill('gradient'),
          yScale: getAxis(),
          xScale: xScale,
          curve: _curve.curveMonotoneX
        }, areaProps)),
        nopattern || !nofill && _react2.default.createElement(_styledComponents.StyledAreaClosed, _extends({ data: data, color: color }, {
          y: yPoints,
          yScale: getAxis(),
          xScale: xScale,
          fill: findFill(),
          x: xPoints,
          curve: _curve.curveMonotoneX
        }, areaProps))
      );
    }
  }]);

  return LineChart;
}(_react.Component);

LineChart.propTypes = {
  /**
   * Specifies which data points the chart should use to draw itself
   **/
  dataKey: _propTypes2.default.string.isRequired,
  /**
   * Optional color prop
   **/
  color: _propTypes2.default.string,
  /**
   * If true, there will be no fill on the line chart.
   **/
  nofill: _propTypes2.default.bool,
  /**
   * If true, there will be no pattern on the line chart.
   */
  nopattern: _propTypes2.default.bool
};

LineChart.defaultProps = {
  color: 'rgb(0, 157, 253)',
  nofill: false,
  nopattern: false
};

exports.default = LineChart;