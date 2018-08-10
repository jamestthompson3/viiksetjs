'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _curve = require('@vx/curve');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('../styledComponents');

var _dataUtils = require('../../utils/dataUtils');

var _chartUtils = require('../../utils/chartUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
          solidFill = _props.solidFill,
          height = _props.height,
          margin = _props.margin,
          nopattern = _props.nopattern,
          inheritedScale = _props.inheritedScale,
          axisId = _props.axisId,
          type = _props.type,
          areaProps = _props.areaProps,
          lineProps = _props.lineProps,
          gradientOpacity = _props.gradientOpacity;

      // Check if data exists

      if (data.map(function (item) {
        return (0, _get2.default)(item, dataKey);
      }).includes(undefined)) {
        // eslint-disable-next-line
        console.error('LineChart: No data found with dataKey ' + dataKey);
        return null;
      }

      if (axisId && data.map(function (item) {
        return (0, _get2.default)(item, axisId);
      }).includes(undefined)) {
        // eslint-disable-next-line
        console.error('LineChart: No data found with axisId ' + axisId);
        return null;
      }

      var yPoints = function yPoints(d) {
        return (0, _get2.default)(d, dataKey);
      };
      var xPoints = function xPoints(d) {
        return xKey ? (0, _get2.default)(d, xKey) : new Date((0, _dataUtils.parseObject)(d, 'string', _dataUtils.checkMoment));
      };
      var dataPoints = data.map(function (item) {
        return (0, _get2.default)(item, dataKey);
      });
      var yScale = (0, _chartUtils.determineYScale)({
        type: type || 'linear',
        yPoints: dataPoints,
        height: height,
        margin: margin
      });
      var getAxis = function getAxis() {
        return !axisId ? inheritedScale : yScale;
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
          _react2.default.createElement(_styledComponents.StyledGradient, { opacity: gradientOpacity, color: color, id: 'gradient' + dataKey }),
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
          fill: solidFill ? color : findFill('gradient'),
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
   * Optional opacity prop, values between 0 and 1
   **/
  opacity: _propTypes2.default.array,

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