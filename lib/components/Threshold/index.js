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

var Threshold = function (_Component) {
  _inherits(Threshold, _Component);

  function Threshold() {
    _classCallCheck(this, Threshold);

    return _possibleConstructorReturn(this, (Threshold.__proto__ || Object.getPrototypeOf(Threshold)).apply(this, arguments));
  }

  _createClass(Threshold, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(prevProps) {
      return this.props.yPoints !== prevProps.yPoints || prevProps.dataKey !== this.props.dataKey;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          data = _props.data,
          _y = _props.y0,
          _y2 = _props.y1,
          xScale = _props.xScale,
          xKey = _props.xKey,
          height = _props.height,
          clipAboveTo = _props.clipAboveTo,
          clipBelowTo = _props.clipBelowTo,
          margin = _props.margin,
          inheritedScale = _props.inheritedScale,
          axisId = _props.axisId,
          aboveAreaProps = _props.aboveAreaProps,
          belowAreaProps = _props.belowAreaProps,
          lineProps = _props.lineProps;

      // Check if data exists

      if (data.map(function (item) {
        return (0, _lodash.get)(item, _y);
      }).includes(undefined)) {
        // eslint-disable-next-line
        console.error('Threshold: No data found with dataKey ' + _y + '. Expecting to find value using y0 prop');
        return null;
      }

      if (axisId && data.map(function (item) {
        return (0, _lodash.get)(item, _y);
      }).includes(undefined)) {
        // eslint-disable-next-line
        console.error('Threshold: No data found with axisId ' + axisId);
        return null;
      }

      var xPoints = function xPoints(d) {
        return xKey ? (0, _lodash.get)(d, xKey) : new Date((0, _dataUtils.parseObject)(d, 'string', _dataUtils.checkMoment));
      };
      var dataPoints = [].concat(_toConsumableArray(data.map(function (item) {
        return (0, _lodash.get)(item, _y);
      })), _toConsumableArray(data.map(function (item) {
        return (0, _lodash.get)(item, _y2);
      })));
      var yScale = (0, _d3Scale.scaleLinear)().domain([0, Math.max.apply(Math, _toConsumableArray(dataPoints))]).range([height, margin.top + margin.top]);
      var getAxis = function getAxis() {
        return !axisId ? inheritedScale : yScale;
      };

      return _react2.default.createElement(_styledComponents.StyledThreshold, _extends({
        x: xPoints,
        y0: function y0(d) {
          return (0, _lodash.get)(d, _y);
        },
        y1: function y1(d) {
          return (0, _lodash.get)(d, _y2);
        },
        yScale: function yScale(d) {
          return getAxis()(d);
        }
      }, { xScale: xScale, data: data, aboveAreaProps: aboveAreaProps, belowAreaProps: belowAreaProps }, {
        clipAboveTo: clipAboveTo || 0,
        clipBelowTo: clipBelowTo || height,
        curve: _curve.curveBasis
      }, lineProps));
    }
  }]);

  return Threshold;
}(_react.Component);

Threshold.propTypes = {
  /**
   * Specifies first threshold category
   */
  y0: _propTypes2.default.string.isRequired,
  /**
   * Specifies second threshold category
   */
  y1: _propTypes2.default.string.isRequired,
  /**
   * Specifies props to area above threshold
   */
  aboveAreaProps: _propTypes2.default.object,
  /**
   * Specifies props to area below threshold
   */
  belowAreaProps: _propTypes2.default.object,
  /**
   * Specifies the clip below
   */
  clipBelowTo: _propTypes2.default.number,
  /**
   * species the clip above
   */
  clipAboveTo: _propTypes2.default.number
};

Threshold.defaultProps = {
  aboveAreaProps: {
    fill: 'green',
    fillOpacity: 0.5
  },
  belowAreaProps: {
    fill: 'red',
    fillOpacity: 0.5
  }
};

exports.default = Threshold;