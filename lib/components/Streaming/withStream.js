'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withStreamPropTypes = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = withStream;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _dataUtils = require('../../utils/dataUtils');

var _chartUtils = require('../../utils/chartUtils');

var _uniq = require('lodash/uniq');

var _uniq2 = _interopRequireDefault(_uniq);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var withStreamPropTypes = exports.withStreamPropTypes = {
  streamData: _propTypes2.default.object
};

function withStream(BaseComponent) {
  var WrappedComponent = function (_React$PureComponent) {
    _inherits(WrappedComponent, _React$PureComponent);

    function WrappedComponent() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, WrappedComponent);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = WrappedComponent.__proto__ || Object.getPrototypeOf(WrappedComponent)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        data: [],
        yScale: null,
        xScale: null,
        yPoints: null,
        chartData: false
      }, _this.fromStream = function (_ref2) {
        var message = _ref2.message,
            mapStream = _ref2.mapStream,
            height = _ref2.height,
            width = _ref2.width,
            xKey = _ref2.xKey,
            yKey = _ref2.yKey,
            type = _ref2.type,
            margin = _ref2.margin,
            persist = _ref2.persist;
        var data = _this.state.data;

        var appendedData = mapStream(data, message).length <= persist ? mapStream(data, message) : mapStream(data, message).slice(1);
        var xPoints = (0, _uniq2.default)((0, _dataUtils.getX)(appendedData, xKey)).map(function (datum) {
          return typeof datum === 'string' && (0, _moment2.default)(datum).isValid() ? (0, _moment2.default)(datum).toDate() : datum;
        });
        var yPoints = (0, _dataUtils.getY)(appendedData, yKey);
        var yScale = (0, _chartUtils.determineYScale)({ type: type, yPoints: yPoints, height: height, margin: margin });
        var xScale = (0, _chartUtils.determineXScale)({ type: type, width: width, xPoints: xPoints, margin: margin });
        return _this.setState({
          data: appendedData,
          yPoints: yPoints,
          yScale: yScale,
          xScale: xScale,
          chartData: true
        });
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(WrappedComponent, [{
      key: 'render',
      value: function render() {
        return _react2.default.createElement(BaseComponent, _extends({ fromStream: this.fromStream }, this.state, this.props));
      }
    }]);

    return WrappedComponent;
  }(_react2.default.PureComponent);

  return WrappedComponent;
}