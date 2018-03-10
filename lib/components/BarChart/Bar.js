'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _group = require('@vx/group');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('../styledComponents');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BarChart = function (_Component) {
  _inherits(BarChart, _Component);

  function BarChart() {
    _classCallCheck(this, BarChart);

    return _possibleConstructorReturn(this, (BarChart.__proto__ || Object.getPrototypeOf(BarChart)).apply(this, arguments));
  }

  _createClass(BarChart, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(prevProps) {
      return !(prevProps.yPoints === this.props.yPoints) || !(prevProps.dataKey === this.props.dataKey);
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
          height = _props.height,
          notool = _props.notool,
          mouseMove = _props.mouseMove,
          mouseLeave = _props.mouseLeave,
          nofill = _props.nofill,
          inheritedScale = _props.inheritedScale;

      if (data.map(function (item) {
        return item[dataKey];
      }).includes(undefined)) {
        new ReferenceError('BarChart: No data found with dataKey ' + dataKey);
        return null;
      }
      var xPoint = function xPoint(d) {
        return xScale(d[xKey]);
      };
      var barHeight = function barHeight(d) {
        return inheritedScale(d[dataKey]);
      };
      console.log('barchart');
      return _react2.default.createElement(
        _react.Fragment,
        null,
        _react2.default.createElement(_styledComponents.StyledGradient, { color: color, id: 'gradient' + xKey }),
        data.map(function (d) {
          return _react2.default.createElement(
            _group.Group,
            { key: 'bar' + xPoint(d) },
            _react2.default.createElement(_styledComponents.StyledBar, {
              width: xScale.bandwidth(),
              height: barHeight(d),
              x: xPoint(d),
              y: height - barHeight(d),
              data: d,
              fill: !nofill && 'url(#gradient' + xKey + ')',
              onMouseMove: function onMouseMove(d) {
                return function (event) {
                  return notool || mouseMove({ event: event, datum: d });
                };
              },
              onMouseLeave: function onMouseLeave() {
                return function (event) {
                  return mouseLeave();
                };
              }
            })
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