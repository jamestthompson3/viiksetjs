'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _group = require('@vx/group');

var _Bar = require('./Bar');

var _Bar2 = _interopRequireDefault(_Bar);

var _d3Shape = require('d3-shape');

var _d3Scale = require('d3-scale');

var _dataUtils = require('../../utils/dataUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = StackedBar.__proto__ || Object.getPrototypeOf(StackedBar)).call.apply(_ref, [this].concat(args))), _this), _this.determineScale = function (type) {
      var _this$props = _this.props,
          xScale = _this$props.xScale,
          yScale = _this$props.yScale;

      return type === 'horizontal' ? xScale : yScale;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(StackedBar, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(prevProps) {
      return !(prevProps.yPoints === this.props.yPoints) || !(prevProps.dataKey === this.props.dataKey);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          data = _props.data,
          top = _props.top,
          left = _props.left,
          y = _props.y,
          xScale = _props.xScale,
          yScale = _props.yScale,
          type = _props.type,
          colors = _props.colors,
          xKey = _props.xKey;

      var keys = (0, _dataUtils.extractLabels)(data[0]);
      var zScale = (0, _d3Scale.scaleOrdinal)().domain(keys).range(colors);
      var scale = this.determineScale(type);
      var series = (0, _d3Shape.stack)().keys(keys)(data);
      var bandwidth = scale.bandwidth();
      var xPoint = function xPoint(d) {
        return xScale(d[xKey]);
      };
      return _react2.default.createElement(
        _group.Group,
        { top: top, left: left },
        series && series.map(function (s, i) {
          return _react2.default.createElement(
            _group.Group,
            { key: i },
            s.map(function (d, ii) {
              var barWidth = scale(d[1]) - scale(d[0]);
              return _react2.default.createElement(_Bar2.default, _extends({
                key: 'bar-group-bar-' + i + '-' + ii + '-' + s.key,
                x: xPoint(d),
                y: yScale(y(d.data)),
                width: barWidth,
                height: bandwidth,
                fill: zScale(s.key),
                data: d
              }, restProps));
            })
          );
        })
      );
    }
  }]);

  return StackedBar;
}(_react.Component);

StackedBar.propTypes = {
  data: _propTypes2.default.array.isRequired,
  y: _propTypes2.default.func.isRequired,
  xScale: _propTypes2.default.func.isRequired,
  yScale: _propTypes2.default.func.isRequired,
  colors: _propTypes2.default.array.isRequired,
  top: _propTypes2.default.number,
  left: _propTypes2.default.number
};

exports.default = StackedBar;