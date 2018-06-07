'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _group = require('@vx/group');

var _d3Scale = require('d3-scale');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('../styledComponents');

var _dataUtils = require('../../utils/dataUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BarChart = function (_Component) {
  _inherits(BarChart, _Component);

  function BarChart() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, BarChart);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = BarChart.__proto__ || Object.getPrototypeOf(BarChart)).call.apply(_ref, [this].concat(args))), _this), _this.determineScales = function (_ref2) {
      var type = _ref2.type;
      var _this$props = _this.props,
          margin = _this$props.margin,
          height = _this$props.height,
          width = _this$props.width,
          yPoints = _this$props.yPoints,
          xPoints = _this$props.xPoints;


      if (type === 'horizontal') {
        var xScale = (0, _d3Scale.scaleLinear)().domain([0, Math.max.apply(Math, _toConsumableArray(yPoints))]).range([margin.left, width]);
        var yScale = (0, _d3Scale.scaleBand)().domain(yPoints).range([height, margin.top]).padding(0.1);

        return { xScale: xScale, yScale: yScale };
      } else {
        var _xScale = (0, _d3Scale.scaleBand)().domain(xPoints).range([margin.left, width]).padding(0.1);
        var _yScale = (0, _d3Scale.scaleLinear)().domain([Math.max.apply(Math, _toConsumableArray(yPoints)), 0]).range([height, margin.top]);

        return { xScale: _xScale, yScale: _yScale };
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(BarChart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.declareBar();
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(prevProps) {
      return prevProps.yPoints !== this.props.yPoints || prevProps.dataKey !== this.props.dataKey;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          data = _props.data,
          color = _props.color,
          dataKey = _props.dataKey,
          xKey = _props.xKey,
          height = _props.height,
          notool = _props.notool,
          mouseMove = _props.mouseMove,
          mouseLeave = _props.mouseLeave,
          nofill = _props.nofill,
          type = _props.type,
          barProps = _props.barProps;


      if (data.map(function (item) {
        return (0, _lodash.get)(item, dataKey);
      }).includes(undefined)) {
        // eslint-disable-next-line
        console.error('BarChart: No data found with dataKey ' + dataKey);
        return null;
      }

      var _determineScales = this.determineScales({ type: type }),
          xScale = _determineScales.xScale,
          yScale = _determineScales.yScale;

      var xPoint = function xPoint(d) {
        return (0, _dataUtils.extractX)(d, xKey);
      };
      var barHeight = function barHeight(d) {
        return yScale((0, _lodash.get)(d, dataKey));
      };
      var isHorizontal = type === 'horizontal';
      return _react2.default.createElement(
        _react.Fragment,
        null,
        _react2.default.createElement(_styledComponents.StyledGradient, { color: color, id: 'gradient' + xKey }),
        data.map(function (d) {
          return _react2.default.createElement(
            _group.Group,
            { key: 'bar' + xPoint(d) },
            _react2.default.createElement(_styledComponents.StyledBar, _extends({
              width: xScale.bandwidth(),
              height: barHeight(d),
              x: xScale(xPoint(d)),
              key: 'BarChart',
              y: isHorizontal ? barHeight(d) : height - barHeight(d),
              data: d,
              fill: !nofill && 'url(#gradient' + xKey + ')',
              onMouseMove: function onMouseMove() {
                return function (event) {
                  return notool || mouseMove({ event: event, datum: d });
                };
              },
              onMouseLeave: function onMouseLeave() {
                return function () {
                  return mouseLeave();
                };
              }
            }, barProps))
          );
        })
      );
    }
  }]);

  return BarChart;
}(_react.Component);

BarChart.propTypes = {
  /**
   * Indicates which data column should draw the BarChart
   */
  dataKey: _propTypes2.default.string.isRequired,
  /**
   * Indicates the color of the BarChart
   */
  color: _propTypes2.default.string
};

BarChart.defaultProps = {
  color: 'rgb(0, 157, 253)',
  nofill: false
};

exports.default = BarChart;