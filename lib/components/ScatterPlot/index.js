'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d3Scale = require('d3-scale');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

var _styledComponents = require('../styledComponents');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScatterPlot = function (_Component) {
  _inherits(ScatterPlot, _Component);

  function ScatterPlot() {
    _classCallCheck(this, ScatterPlot);

    return _possibleConstructorReturn(this, (ScatterPlot.__proto__ || Object.getPrototypeOf(ScatterPlot)).apply(this, arguments));
  }

  _createClass(ScatterPlot, [{
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
          opacity = _props.opacity,
          radius = _props.radius,
          height = _props.height,
          margin = _props.margin,
          inheritedScale = _props.inheritedScale,
          axisId = _props.axisId,
          rest = _objectWithoutProperties(_props, ['data', 'color', 'dataKey', 'xScale', 'xKey', 'opacity', 'radius', 'height', 'margin', 'inheritedScale', 'axisId']);

      // Check if data exists


      if (data.map(function (item) {
        return (0, _lodash.get)(item, dataKey);
      }).includes(undefined)) {
        // eslint-disable-next-line
        new console.error('LineChart: No data found with dataKey ' + dataKey);
        return null;
      }

      if (axisId && data.map(function (item) {
        return (0, _lodash.get)(item, axisId);
      }).includes(undefined)) {
        // eslint-disable-next-line
        new console.error('LineChart: No data found with axisId ' + axisId);
        return null;
      }

      var getAxis = function getAxis() {
        return !axisId ? inheritedScale : yScale;
      };
      var dataPoints = data.map(function (item) {
        return (0, _lodash.get)(item, dataKey);
      });
      var yPoints = function yPoints(d) {
        return getAxis()((0, _lodash.get)(d, dataKey));
      };
      var xPoints = function xPoints(d) {
        return xScale(xKey ? (0, _lodash.get)(d, xKey) : (0, _lodash.flatten)(Object.values(d).map(function (value) {
          if (typeof value === 'string') {
            return (0, _moment2.default)(value);
          }
        })
        // eslint-disable-next-line
        ).filter(function (i) {
          return i != null;
        })[0]);
      };
      var yScale = (0, _d3Scale.scaleLinear)().domain([0, Math.max.apply(Math, _toConsumableArray(dataPoints))]).range([height, margin.top + margin.top]);
      return _react2.default.createElement(
        _react.Fragment,
        null,
        data.map(function (d, i) {
          return _react2.default.createElement(_styledComponents.StyledPoint, _extends({
            key: i,
            x: xPoints(d),
            y: yPoints(d),
            radius: radius,
            opacity: opacity,
            color: color
          }, rest));
        })
      );
    }
  }]);

  return ScatterPlot;
}(_react.Component);

ScatterPlot.propTypes = {
  /**
   * Specifies which data points the chart should use to draw itself
   */
  dataKey: _propTypes2.default.string.isRequired,
  /**
   * Specifies the radius of Scatterplot dots
   */
  radius: _propTypes2.default.number,
  /**
   * Optional color prop
   **/
  color: _propTypes2.default.string,
  /**
   * Opacity for points on scatterplot
   **/
  opacity: _propTypes2.default.number
};

ScatterPlot.defaultProps = {
  color: 'rgb(0, 157, 253)',
  opacity: 0.8,
  radius: 8
};

exports.default = ScatterPlot;