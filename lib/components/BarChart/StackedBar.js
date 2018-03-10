'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _group = require('@vx/group');

var _d3Shape = require('d3-shape');

var _d3Scale = require('d3-scale');

var _lodash = require('lodash');

var _dataUtils = require('../../utils/dataUtils');

var _styledComponents = require('../styledComponents');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StackedBar = function (_Component) {
  _inherits(StackedBar, _Component);

  function StackedBar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, StackedBar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = StackedBar.__proto__ || Object.getPrototypeOf(StackedBar)).call.apply(_ref, [this].concat(args))), _this), _this.determineScales = function (_ref2) {
      var type = _ref2.type,
          data = _ref2.data,
          keys = _ref2.keys;
      var _this$props = _this.props,
          margin = _this$props.margin,
          height = _this$props.height,
          width = _this$props.width,
          yPoints = _this$props.yPoints,
          xPoints = _this$props.xPoints;

      var dataDomain = Math.max.apply(Math, _toConsumableArray((0, _lodash.flatten)(data.map(function (d) {
        return keys.map(function (key) {
          return (0, _lodash.get)(d, key);
        });
      }).map(function (arr) {
        return (0, _lodash.sum)(arr);
      }))));
      if (type === 'horizontal') {
        var xScale = (0, _d3Scale.scaleLinear)().domain([0, dataDomain]).range([margin.left, width]);
        var yScale = (0, _d3Scale.scaleBand)().domain(yPoints).range([height, margin.top]).padding(0.1);
        return { xScale: xScale, yScale: yScale };
      } else {
        var _xScale = (0, _d3Scale.scaleBand)().domain(xPoints).range([margin.left, width]).padding(0.1);
        var _yScale = (0, _d3Scale.scaleLinear)().domain([dataDomain, 0]).range([height, margin.top]);
        return { xScale: _xScale, yScale: _yScale };
      }
    }, _this.determineBarWidth = function (_ref3) {
      var d = _ref3.d,
          isHorizontal = _ref3.isHorizontal,
          xScale = _ref3.xScale,
          yScale = _ref3.yScale;

      if (isHorizontal) {
        return xScale(d[1]) - xScale(d[0]);
      } else {
        return yScale(d[1]) - yScale(d[0]);
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(StackedBar, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(prevProps) {
      return !(prevProps.yPoints === this.props.yPoints) || !(prevProps.keys === this.props.keys);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          data = _props.data,
          type = _props.type,
          colors = _props.colors,
          xKey = _props.xKey,
          keys = _props.keys,
          yKey = _props.yKey,
          width = _props.width,
          height = _props.height,
          margin = _props.margin,
          notool = _props.notool,
          mouseMove = _props.mouseMove,
          mouseLeave = _props.mouseLeave;

      if (!keys) {
        // eslint-disable-next-line
        console.warn('StackedBar: You have not provided the keys prop, this could explain unexpected render output');
      }
      var zScale = (0, _d3Scale.scaleOrdinal)().domain(keys || (0, _dataUtils.extractLabels)(data[0])).range(colors);

      var _determineScales = this.determineScales({ type: type, data: data, keys: keys }),
          xScale = _determineScales.xScale,
          yScale = _determineScales.yScale;

      var isHorizontal = type === 'horizontal';
      var series = (0, _d3Shape.stack)().keys(keys || (0, _dataUtils.extractLabels)(data[0]))(data);
      var bandwidth = isHorizontal ? yScale.bandwidth() : xScale.bandwidth();
      var xPoint = function xPoint(d) {
        return xScale(d[xKey]);
      };
      var yPoint = function yPoint(d) {
        return yScale(d[yKey]);
      };
      return _react2.default.createElement(
        _group.Group,
        null,
        series && series.map(function (s, i) {
          return _react2.default.createElement(
            _group.Group,
            { key: i },
            s.map(function (d, ii) {
              var barWidth = _this2.determineBarWidth({ d: d, isHorizontal: isHorizontal, xScale: xScale, yScale: yScale });
              return _react2.default.createElement(_styledComponents.StyledBar, {
                key: 'bar-group-bar-' + i + '-' + ii + '-' + s.key,
                x: isHorizontal ? width + margin.left - xScale(d[1]) : xPoint(d.data),
                y: isHorizontal ? yPoint(d.data) : height + margin.top - yScale(d[1]),
                width: isHorizontal ? barWidth : bandwidth,
                height: isHorizontal ? bandwidth : barWidth,
                fill: zScale(s.key),
                data: d.data,
                onMouseMove: function onMouseMove(data) {
                  return function (event) {
                    var key = s.key;
                    return notool || mouseMove({ event: event, datum: (0, _lodash.set)({}, key, data[key]) });
                  };
                },
                onMouseLeave: function onMouseLeave() {
                  return function (event) {
                    return mouseLeave();
                  };
                }
              });
            })
          );
        })
      );
    }
  }]);

  return StackedBar;
}(_react.Component);

StackedBar.propTypes = {
  xScale: _propTypes2.default.func,
  inheritedScale: _propTypes2.default.func,
  colors: _propTypes2.default.array,
  top: _propTypes2.default.number,
  left: _propTypes2.default.number
};

exports.default = StackedBar;