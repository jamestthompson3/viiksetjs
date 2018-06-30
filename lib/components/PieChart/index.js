'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteral(['\n  display: flex;\n  flex-direction: column;\n  padding: 8px;\n  position: relative;\n  border-radius: 3px;\n  background: #333;\n  color: #fff;\n  width: 200px;\n  border: ', ';\n  font-size: 12px;\n  pointer-events: none;\n'], ['\n  display: flex;\n  flex-direction: column;\n  padding: 8px;\n  position: relative;\n  border-radius: 3px;\n  background: #333;\n  color: #fff;\n  width: 200px;\n  border: ', ';\n  font-size: 12px;\n  pointer-events: none;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _group = require('@vx/group');

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledComponents3 = require('../styledComponents');

var _withParentSize = require('../Responsive/withParentSize');

var _withParentSize2 = _interopRequireDefault(_withParentSize);

var _withTooltip = require('../Tooltip/withTooltip');

var _withTooltip2 = _interopRequireDefault(_withTooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Label = function Label(_ref) {
  var x = _ref.x,
      y = _ref.y,
      labelProps = _ref.labelProps,
      labelText = _ref.labelText;
  return _react2.default.createElement(
    _styledComponents3.StyledText,
    _extends({ x: x, y: y }, labelProps),
    labelText
  );
};

Label.defaultProps = {
  labelProps: { fill: 'black', textAnchor: 'middle', dy: '.33em', fontSize: 10 }
};

var TooltipContainer = _styledComponents2.default.div.attrs({
  style: function style(_ref2) {
    var mouseY = _ref2.mouseY,
        mouseX = _ref2.mouseX,
        height = _ref2.height,
        width = _ref2.width;
    return {
      top: mouseY - height,
      left: mouseX + width / 2
    };
  }
})(_templateObject, function (p) {
  return '2px solid ' + (0, _styledComponents3.findColor)(p);
});

var defaultPieTooltip = function defaultPieTooltip(_ref3) {
  var tooltipData = _ref3.tooltipData,
      height = _ref3.height,
      width = _ref3.width,
      mouseX = _ref3.mouseX,
      mouseY = _ref3.mouseY,
      color = _ref3.color,
      tooltipContent = _ref3.tooltipContent;

  return _react2.default.createElement(
    TooltipContainer,
    { mouseX: mouseX, height: height, width: width, mouseY: mouseY, color: color },
    tooltipContent({ tooltipData: tooltipData })
  );
};

var PieChart = function (_Component) {
  _inherits(PieChart, _Component);

  function PieChart() {
    var _ref4;

    var _temp, _this, _ret;

    _classCallCheck(this, PieChart);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref4 = PieChart.__proto__ || Object.getPrototypeOf(PieChart)).call.apply(_ref4, [this].concat(args))), _this), _this.mouseMove = function (_ref5) {
      var _ref5$d = _ref5.d,
          data = _ref5$d.data,
          centroid = _ref5$d.centroid;
      var updateTooltip = _this.props.updateTooltip;

      return updateTooltip({
        calculatedData: data,
        mouseX: centroid[0],
        mouseY: centroid[1],
        showTooltip: true
      });
    }, _this.mouseLeave = function () {
      return _this.props.updateTooltip({ calculatedData: null, showTooltip: false, x: null, yCoords: null });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PieChart, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          data = _props.data,
          color = _props.color,
          dataKey = _props.dataKey,
          _props$size = _props.size,
          height = _props$size.height,
          width = _props$size.width,
          labelKey = _props.labelKey,
          determineOpacity = _props.determineOpacity,
          innerRadius = _props.innerRadius,
          mouseY = _props.mouseY,
          mouseX = _props.mouseX,
          calculatedData = _props.calculatedData,
          showTooltip = _props.showTooltip,
          tooltipRenderer = _props.tooltipRenderer,
          tooltipContent = _props.tooltipContent,
          outerRadius = _props.outerRadius;

      var radius = Math.min(width, height) / 2;
      return _react2.default.createElement(
        _react.Fragment,
        null,
        _react2.default.createElement(
          'svg',
          { width: width, height: height },
          _react2.default.createElement(
            _group.Group,
            { top: height / 2, left: width / 2 },
            _react2.default.createElement(_styledComponents3.StyledPie, {
              data: data,
              pieValue: function pieValue(d) {
                return (0, _get2.default)(d, dataKey);
              },
              innerRadius: radius - innerRadius,
              outerRadius: radius - outerRadius,
              fill: color,
              fillOpacity: function fillOpacity(_ref6) {
                var data = _ref6.data;
                return determineOpacity(data);
              },
              onMouseEnter: function onMouseEnter(d) {
                return function () {
                  return _this2.mouseMove({ d: d });
                };
              },
              onMouseLeave: function onMouseLeave() {
                return _this2.mouseLeave;
              },
              centroid: function centroid(_centroid2, arc) {
                var _centroid = _slicedToArray(_centroid2, 2),
                    x = _centroid[0],
                    y = _centroid[1];

                var data = arc.data;

                return _react2.default.createElement(Label, { x: x, y: y, labelText: (0, _get2.default)(data, labelKey) });
              }
            })
          )
        ),
        showTooltip && tooltipRenderer(_extends({
          tooltipData: calculatedData,
          tooltipContent: tooltipContent,
          mouseX: mouseX,
          mouseY: mouseY,
          height: height,
          color: color,
          width: width
        }))
      );
    }
  }]);

  return PieChart;
}(_react.Component);

PieChart.propTypes = {
  data: _propTypes2.default.array.isRequired,
  color: _propTypes2.default.string,
  /**
   * Prop for the key containing the label names
   */
  labelKey: _propTypes2.default.string.isRequired,
  /**
   * Prop for the key containing the data
   */
  dataKey: _propTypes2.default.string.isRequired,
  /**
   * Prop for determining the opacity of the pie pieces
   */
  determineOpacity: _propTypes2.default.func,
  /**
   * innerRadius offset
   */
  innerRadius: _propTypes2.default.number,
  /**
   * outerRadius offset
   */
  outerRadius: _propTypes2.default.number
};

PieChart.defaultProps = {
  determineOpacity: function determineOpacity() {
    return 0.5;
  },
  tooltipRenderer: defaultPieTooltip,
  tooltipContent: _styledComponents3.defaultTooltipContent,
  innerRadius: 0,
  outerRadius: 0,
  margin: { top: 10, bottom: 10, left: 10, right: 10 }
};

exports.default = (0, _withTooltip2.default)((0, _withParentSize2.default)(PieChart));