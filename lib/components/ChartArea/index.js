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

var _shape = require('@vx/shape');

var _d3Array = require('d3-array');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _dataUtils = require('../../utils/dataUtils');

var _formatUtils = require('../../utils/formatUtils');

var _chartUtils = require('../../utils/chartUtils');

var _withTooltip = require('../Tooltip/withTooltip');

var _withTooltip2 = _interopRequireDefault(_withTooltip);

var _withParentSize = require('../Responsive/withParentSize');

var _withParentSize2 = _interopRequireDefault(_withParentSize);

var _index = require('../styledComponents/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var margin = { top: 18, right: 15, bottom: 15, left: 30 };

var ChartArea = function (_Component) {
  _inherits(ChartArea, _Component);

  function ChartArea() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ChartArea);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ChartArea.__proto__ || Object.getPrototypeOf(ChartArea)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      chartData: false
    }, _this.calculateData = function () {
      _this.setState({ chartData: false });
      var _this$props = _this.props,
          data = _this$props.data,
          children = _this$props.children,
          size = _this$props.size,
          xKey = _this$props.xKey,
          yKey = _this$props.yKey,
          type = _this$props.type,
          margin = _this$props.margin;

      if ((0, _lodash.isEmpty)(data)) {
        // eslint-disable-next-line
        console.error('Data is empty, cannot calculate chart');
        return null;
      }
      var biaxialChildren = (0, _chartUtils.biaxial)(children);
      var dataKeys = (0, _dataUtils.extractLabels)(data[0]);
      var width = size.width - margin.left - margin.right;
      var height = size.height - margin.top - margin.bottom;
      var xPoints = (0, _lodash.uniq)((0, _dataUtils.getX)(data, xKey)).map(function (datum) {
        return typeof datum === 'string' && (0, _moment2.default)(datum).isValid() ? (0, _moment2.default)(datum).toDate() : datum;
      });
      var yPoints = (0, _dataUtils.getY)(data, yKey);
      var yScale = (0, _chartUtils.determineYScale)({ type: type, yPoints: yPoints, height: height, margin: margin });
      var yScales = biaxialChildren && (0, _dataUtils.createScalarData)(data, dataKeys, height, margin);
      var xScale = (0, _chartUtils.determineXScale)({ type: type, width: width, xPoints: xPoints, margin: margin });
      return _this.setState({
        width: width,
        height: height,
        xPoints: xPoints,
        xScale: xScale,
        yScale: yScale,
        yPoints: yPoints,
        biaxialChildren: biaxialChildren,
        yScales: yScales,
        dataKeys: dataKeys,
        chartData: true
      });
    }, _this.mouseMove = function (_ref2) {
      var event = _ref2.event,
          datum = _ref2.datum;
      var _this$state = _this.state,
          xPoints = _this$state.xPoints,
          xScale = _this$state.xScale,
          yScale = _this$state.yScale,
          yScales = _this$state.yScales,
          dataKeys = _this$state.dataKeys;
      var _this$props2 = _this.props,
          data = _this$props2.data,
          updateTooltip = _this$props2.updateTooltip,
          xKey = _this$props2.xKey;

      var svgPoint = (0, _chartUtils.localPoint)(_this.chart, event).x;
      if (datum) {
        return updateTooltip({ calculatedData: datum, x: svgPoint, mouseX: svgPoint });
      } else {
        var xValue = xScale.invert(svgPoint);
        (0, _lodash.flow)(function (xValue) {
          return (0, _d3Array.bisect)(xPoints, xValue);
        }, function (index) {
          var bounds = { dLeft: data[index - 1], dRight: data[index] };
          return xValue - xPoints[index - 1] > xPoints[index] - xValue ? bounds.dRight || bounds.dLeft : bounds.dLeft || bounds.dRight;
        }, function (calculatedData) {
          var x = xScale((0, _lodash.head)((0, _dataUtils.extractX)(calculatedData, xKey)));
          var yCoords = yScales ? dataKeys.map(function (key) {
            return yScales[key](calculatedData[key]);
          }) : (0, _dataUtils.extractY)(calculatedData).map(function (item) {
            return yScale(item);
          });
          return updateTooltip({ calculatedData: calculatedData, x: x, mouseX: svgPoint, yCoords: yCoords });
        })(xValue);
      }
    }, _this.mouseLeave = function () {
      return _this.props.updateTooltip({ calculatedData: null, x: null, yCoords: null });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ChartArea, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.calculateData();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var dataWasChanged = prevProps.data !== this.props.data;
      var widthWasChanged = prevProps.size && prevProps.size.width !== this.props.size.width;
      var heightWasChanged = prevProps.size && prevProps.size.height !== this.props.size.height;
      var typeWasChanged = prevProps.type !== this.props.type;
      if (dataWasChanged || widthWasChanged || heightWasChanged || typeWasChanged) {
        return this.calculateData();
      }
    }
    // TODO WORK WITH DT OBJECTS

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          width = _state.width,
          height = _state.height,
          xScale = _state.xScale,
          yScale = _state.yScale,
          biaxialChildren = _state.biaxialChildren,
          chartData = _state.chartData,
          yPoints = _state.yPoints,
          xPoints = _state.xPoints;
      var _props = this.props,
          size = _props.size,
          children = _props.children,
          viewBox = _props.viewBox,
          data = _props.data,
          xKey = _props.xKey,
          formatY = _props.formatY,
          formatX = _props.formatX,
          yKey = _props.yKey,
          labelY = _props.labelY,
          labelYProps = _props.labelYProps,
          labelX = _props.labelX,
          labelXProps = _props.labelXProps,
          yTickLabelProps = _props.yTickLabelProps,
          xTickLabelProps = _props.xTickLabelProps,
          numXTicks = _props.numXTicks,
          numYTicks = _props.numYTicks,
          type = _props.type,
          stroke = _props.stroke,
          nogrid = _props.nogrid,
          notool = _props.notool,
          color = _props.color,
          yCoords = _props.yCoords,
          noYaxis = _props.noYaxis,
          calculatedData = _props.calculatedData,
          Tooltip = _props.tooltip,
          Indicator = _props.indicator,
          mouseX = _props.mouseX,
          x = _props.x;

      return chartData && _react2.default.createElement(
        _react.Fragment,
        null,
        _react2.default.createElement(
          'svg',
          {
            width: size.width,
            height: size.height,
            preserveAspectRatio: 'none',
            viewBox: viewBox || (0, _chartUtils.determineViewBox)(biaxialChildren, margin, size.width, size.height),
            ref: function ref(svg) {
              return _this2.chart = svg;
            }
          },
          _react.Children.map(children, function (child) {
            return (0, _react.cloneElement)(child, {
              data: data,
              xScale: xScale,
              margin: margin,
              height: height,
              yPoints: yPoints,
              xPoints: xPoints,
              width: width,
              notool: notool,
              type: type,
              mouseMove: _this2.mouseMove,
              mouseLeave: _this2.mouseLeave,
              xKey: xKey,
              yKey: yKey,
              inheritedScale: yScale,
              formatY: formatY,
              numYTicks: numYTicks,
              formatX: formatX
            });
          }),
          _react2.default.createElement(
            _group.Group,
            { left: margin.left },
            (0, _chartUtils.barChart)(children) || _react2.default.createElement(_shape.Bar, {
              width: width - margin.left,
              height: height,
              fill: 'transparent',
              onMouseMove: function onMouseMove() {
                return function (event) {
                  notool || _this2.mouseMove({ event: event });
                };
              },
              onMouseLeave: function onMouseLeave() {
                return _this2.mouseLeave;
              }
            }),
            !nogrid && _react2.default.createElement(_index.StyledGridRows, _extends({ scale: yScale }, { stroke: stroke }, { width: width - margin.left })),
            biaxialChildren || noYaxis || _react2.default.createElement(_index.StyledLeftAxis, _extends({
              scale: (0, _chartUtils.determineYScale)({
                type: type === 'horizontal' ? 'horizontal' : null,
                yPoints: yPoints,
                height: height,
                margin: margin
              })
            }, { color: color, numTicks: numYTicks, tickLabels: yTickLabelProps }, {
              hideTicks: true,
              tickFormat: formatY,
              label: labelY || '',
              labelProps: labelYProps
            }))
          ),
          _react2.default.createElement(_index.StyledBottomAxis, _extends({
            scale: xScale,
            left: -margin.right
          }, { color: color, height: height, margin: margin, numTicks: numXTicks, tickLabels: xTickLabelProps }, {
            hideTicks: true,
            tickFormat: formatX,
            label: labelX || '',
            labelProps: labelXProps
          })),
          x && !(0, _chartUtils.barChart)(children) && _react2.default.createElement(Indicator, { yCoords: yCoords, x: x, stroke: stroke, color: color, height: height, mouseX: mouseX })
        ),
        x && _react2.default.createElement(Tooltip, _extends({ tooltipData: calculatedData }, { x: x, color: color, yCoords: yCoords, mouseX: mouseX, height: height }))
      );
    }
  }]);

  return ChartArea;
}(_react.Component);

ChartArea.propTypes = {
  data: _propTypes2.default.array.isRequired,
  /**
   * Optional prop to apply color axes and x-ticks
   */
  color: _propTypes2.default.string,
  /**
   * Optional prop to apply color gridlines
   */
  stroke: _propTypes2.default.string,
  /**
   * A string indicating the type of scale the type should have, defaults to timeseries
   */
  type: _propTypes2.default.oneOf(['ordinal', 'linear']),
  /**
   * A string indicating which data values should be used to create the x-axis
   */
  xKey: _propTypes2.default.string,
  /**
   * A React component to return as a tooltip
   */
  tooltip: _propTypes2.default.func,
  /**
   * A React component made with SVG to indicate the tooltip position
   */
  indicator: _propTypes2.default.func,
  /**
   * A function which formats the yAxis
   */
  formatY: _propTypes2.default.func,
  /**
   * If true, no Yaxis will be shown
   */
  noYaxis: _propTypes2.default.bool,
  /**
   * A label for the yAxis
   */
  labelY: _propTypes2.default.string,
  /**
   * Label props object for yLabel
   */
  labelYProps: _propTypes2.default.object,
  /**
   * Label props for y ticks
   */
  yTickLabelProps: _propTypes2.default.function,
  /**
   * A label for the xAxis
   */
  labelX: _propTypes2.default.string,
  /**
   * Label props object for xLabel
   */
  labelXProps: _propTypes2.default.object,
  /**
   * Label props for x ticks
   */
  xTickLabelProps: _propTypes2.default.function,
  /**
   * Number of ticks for xAxis
   */
  numXTicks: _propTypes2.default.number,
  /**
   * Number of ticks for yAxis
   */
  numYTicks: _propTypes2.default.number,
  /**
   * A function which formats the xAxis
   */
  formatX: _propTypes2.default.func,
  /**
   * An optional string for the chart viewbox
   */
  viewBox: _propTypes2.default.string,
  /**
   * If true, no gridlines will be shown.
   */
  nogrid: _propTypes2.default.bool,
  /**
   * If true, no tooltip will be shown.
   */
  notool: _propTypes2.default.bool,
  /**
   * An optional prop for chart margins
   */
  margin: _propTypes2.default.object
};

ChartArea.defaultProps = {
  data: [],
  color: '#000',
  stroke: '#000',
  tooltip: _index.TooltipComponent,
  nogrid: false,
  indicator: _index.Indicator,
  formatY: _formatUtils.formatTicks,
  labelY: '',
  labelX: '',
  numXTicks: 6,
  numYTicks: 4,
  labelYProps: { fontSize: 12, textAnchor: 'middle', fill: 'black' },
  labelXProps: { fontSize: 12, textAnchor: 'middle', fill: 'black', dy: '-0.5rem' },
  formatX: _formatUtils.formatXTicks,
  margin: margin
};

exports.default = (0, _withTooltip2.default)((0, _withParentSize2.default)(ChartArea));