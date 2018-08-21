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

var _flow = require('lodash/flow');

var _flow2 = _interopRequireDefault(_flow);

var _uniq = require('lodash/uniq');

var _uniq2 = _interopRequireDefault(_uniq);

var _head = require('lodash/head');

var _head2 = _interopRequireDefault(_head);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _dataUtils = require('../../utils/dataUtils');

var _formatUtils = require('../../utils/formatUtils');

var _chartUtils = require('../../utils/chartUtils');

var _withTooltip = require('../Tooltip/withTooltip');

var _withTooltip2 = _interopRequireDefault(_withTooltip);

var _withParentSize = require('../Responsive/withParentSize');

var _withParentSize2 = _interopRequireDefault(_withParentSize);

var _styledComponents = require('../styledComponents');

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
      bar: false,
      chartData: false
    }, _this.declareBar = function () {
      return _this.setState({ bar: true });
    }, _this.calculateData = function () {
      var _this$props = _this.props,
          children = _this$props.children,
          size = _this$props.size,
          xKey = _this$props.xKey,
          yKey = _this$props.yKey,
          type = _this$props.type,
          margin = _this$props.margin,
          data = _this$props.data;


      if ((0, _isEmpty2.default)(data)) {
        // eslint-disable-next-line
        console.error('Data is empty, cannot calculate chart');
        return null;
      }

      var biaxialChildren = (0, _chartUtils.biaxial)(children);
      var dataKeys = (0, _dataUtils.extractLabels)(data[0]);
      var width = size.width - margin.left - margin.right;
      var height = size.height === 0 ? 300 : size.height - margin.top - margin.bottom;
      var xPoints = (0, _uniq2.default)((0, _dataUtils.getX)(data, xKey));
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
          xPoints = _ref2.xPoints,
          xScale = _ref2.xScale,
          yScale = _ref2.yScale,
          yScales = _ref2.yScales,
          dataKeys = _ref2.dataKeys,
          datum = _ref2.datum;
      var _this$props2 = _this.props,
          data = _this$props2.data,
          updateTooltip = _this$props2.updateTooltip,
          xKey = _this$props2.xKey,
          type = _this$props2.type;

      var svgPoint = (0, _chartUtils.localPoint)(_this.chart, event);

      if (datum) {
        return updateTooltip({
          calculatedData: datum,
          x: (0, _get2.default)(svgPoint, 'x'),
          mouseX: (0, _get2.default)(svgPoint, 'x'),
          mouseY: (0, _get2.default)(svgPoint, 'y'),
          showTooltip: true
        });
      }

      var xValue = xScale.invert((0, _get2.default)(svgPoint, 'x'));
      return (0, _flow2.default)(function (xValue) {
        return (0, _d3Array.bisect)(xPoints, xValue);
      }, function (index) {
        var bounds = { dLeft: data[index - 1], dRight: data[index] };
        return xValue - xPoints[index - 1] > xPoints[index] - xValue ? bounds.dRight || bounds.dLeft : bounds.dLeft || bounds.dRight;
      }, function (calculatedData) {
        var calculatedX = (0, _head2.default)((0, _dataUtils.extractX)(calculatedData, xKey));
        var x = (0, _chartUtils.findTooltipX)({ type: type, calculatedX: calculatedX, xScale: xScale });
        var yCoords = yScales ? dataKeys.map(function (key) {
          return yScales[key](calculatedData[key]);
        }) : (0, _dataUtils.extractY)(calculatedData).map(function (item) {
          return yScale(item);
        });
        return updateTooltip({
          calculatedData: calculatedData,
          x: x,
          showTooltip: true,
          mouseX: (0, _get2.default)(svgPoint, 'x'),
          mouseY: (0, _get2.default)(svgPoint, 'y'),
          yCoords: yCoords
        });
      })(xValue);
    }, _this.mouseLeave = function () {
      return _this.props.updateTooltip({ calculatedData: null, x: null, yCoords: null, showTooltip: false });
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
      var heightWasChanged = prevProps.size.height !== 0 && prevProps.size.height !== this.props.size.height;
      var typeWasChanged = prevProps.type !== this.props.type;

      if (dataWasChanged || widthWasChanged || heightWasChanged || typeWasChanged) {
        return this.calculateData();
      }
    }

    // To prevent tooltips from not showing on bar chart due to minification changing names

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          bar = _state.bar,
          width = _state.width,
          height = _state.height,
          xScale = _state.xScale,
          yScale = _state.yScale,
          yScales = _state.yScales,
          biaxialChildren = _state.biaxialChildren,
          chartData = _state.chartData,
          dataKeys = _state.dataKeys,
          yPoints = _state.yPoints,
          xPoints = _state.xPoints;
      var _props = this.props,
          size = _props.size,
          children = _props.children,
          determineViewBox = _props.determineViewBox,
          data = _props.data,
          noYAxis = _props.noYAxis,
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
          xAxisProps = _props.xAxisProps,
          yAxisProps = _props.yAxisProps,
          numXTicks = _props.numXTicks,
          numYTicks = _props.numYTicks,
          type = _props.type,
          orientation = _props.orientation,
          stroke = _props.stroke,
          nogrid = _props.nogrid,
          notool = _props.notool,
          gridStroke = _props.gridStroke,
          color = _props.color,
          yCoords = _props.yCoords,
          calculatedData = _props.calculatedData,
          glyphRenderer = _props.glyphRenderer,
          tooltipRenderer = _props.tooltipRenderer,
          tooltipContent = _props.tooltipContent,
          Indicator = _props.indicator,
          mouseX = _props.mouseX,
          showTooltip = _props.showTooltip,
          mouseY = _props.mouseY,
          x = _props.x;

      return chartData && _react2.default.createElement(
        _react.Fragment,
        null,
        _react2.default.createElement(
          'svg',
          {
            width: size.width,
            height: height + margin.top + margin.bottom,
            preserveAspectRatio: 'none',
            viewBox: determineViewBox ? determineViewBox({ size: size, margin: margin }) : '-10 0 ' + size.width + ' ' + size.height,
            ref: function ref(svg) {
              return _this2.chart = svg;
            }
          },
          _react2.default.createElement(
            _group.Group,
            { left: margin.left },
            !nogrid && _react2.default.createElement(_styledComponents.StyledGridRows, {
              scale: yScale,
              stroke: gridStroke || stroke,
              width: width - margin.left
            }),
            biaxialChildren || noYAxis || _react2.default.createElement(_styledComponents.StyledLeftAxis, _extends({
              scale: (0, _chartUtils.determineYScale)({
                type: type,
                orientation: orientation,
                yPoints: yPoints,
                height: height,
                margin: margin
              })
            }, _extends({
              color: color,
              numTicks: numYTicks,
              tickLabelProps: yTickLabelProps
            }, yAxisProps), {
              hideTicks: true,
              tickFormat: formatY,
              label: labelY || '',
              labelProps: labelYProps
            }))
          ),
          (0, _chartUtils.recursiveCloneChildren)(children, {
            data: data,
            xScale: xScale,
            margin: margin,
            height: height,
            yPoints: yPoints,
            xPoints: xPoints,
            width: width,
            notool: notool,
            declareBar: this.declareBar,
            type: type,
            orientation: orientation,
            mouseMove: this.mouseMove,
            mouseLeave: this.mouseLeave,
            xKey: xKey,
            yKey: yKey,
            inheritedScale: yScale,
            formatY: formatY,
            numYTicks: numYTicks,
            formatX: formatX
          }),
          _react2.default.createElement(
            _group.Group,
            { left: margin.left },
            bar || _react2.default.createElement(_shape.Bar, {
              width: width,
              height: height,
              fill: 'transparent',
              onMouseMove: function onMouseMove() {
                return function (event) {
                  notool || _this2.mouseMove({ event: event, xPoints: xPoints, xScale: xScale, yScale: yScale, yScales: yScales, dataKeys: dataKeys });
                };
              },
              onTouchMove: function onTouchMove() {
                return function (event) {
                  notool || _this2.mouseMove({ event: event, xPoints: xPoints, xScale: xScale, yScale: yScale, yScales: yScales, dataKeys: dataKeys });
                };
              },
              onTouchEnd: function onTouchEnd() {
                return _this2.mouseLeave;
              },
              onMouseLeave: function onMouseLeave() {
                return _this2.mouseLeave;
              }
            })
          ),
          glyphRenderer && glyphRenderer({ width: width, height: height, xScale: xScale, yScale: yScale, margin: margin }),
          _react2.default.createElement(_styledComponents.StyledBottomAxis, _extends({
            scale: xScale
          }, _extends({
            color: color,
            height: height,
            margin: margin,
            numTicks: numXTicks,
            tickLabelProps: xTickLabelProps
          }, xAxisProps), {
            hideTicks: true,
            tickFormat: formatX,
            label: labelX || '',
            labelProps: labelXProps
          })),
          x && !bar && _react2.default.createElement(Indicator, { yCoords: yCoords, x: x, stroke: stroke, color: color, height: height, mouseX: mouseX })
        ),
        showTooltip && tooltipRenderer(_extends({
          tooltipData: calculatedData,
          tooltipContent: tooltipContent,
          yCoords: yCoords,
          x: x,
          mouseX: mouseX,
          mouseY: mouseY,
          height: height,
          color: color
        }))
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
   * Optional prop to apply color gridlines and/or indicator
   */
  stroke: _propTypes2.default.string,
  /**
   * Optional prop to apply color gridlines
   */
  gridStroke: _propTypes2.default.string,
  /**
   * A string indicating the type of scale the type should have, defaults to timeseries
   */
  type: _propTypes2.default.oneOf(['ordinal', 'linear']),
  /**
   * A string indicating the orientation the chart should have
   */
  orientation: _propTypes2.default.oneOf(['horizontal']),

  /**
   * A string indicating which data values should be used to create the x-axis
   */
  xKey: _propTypes2.default.string,
  /**
   * A function that returns React component to return as a tooltip receives as props the following:
   * @param {Object} tooltipData - calculated data returned from tooltip calculations
   * @param {Number} x - x coordinate of closest data point
   * @param {Number} mouseX - x coordinate of mouse position
   * @param {Number} mouseY - y coordinate of mouse position
   * @param {Object[]} yCoords - array of y coordinates of closest data point(s)
   * @param {String} color - string of color inherited from ChartArea
   * @returns {ReactElement} Tooltip - TooltipComponent
   */
  tooltipRenderer: _propTypes2.default.func,
  /**
   * A function that returns a React Component that renders inside the default tooltip container
   * @param {Object} tooltipData - calculated data returned from tooltip calculations
   * @returns {ReactElement} TooltipContent
   */
  tooltipContent: _propTypes2.default.func,
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
  noYAxis: _propTypes2.default.bool,
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
  yTickLabelProps: _propTypes2.default.func,
  /**
   * A label for the xAxis
   */
  labelX: _propTypes2.default.string,
  /**
   * Label props object for xLabel
   */
  labelXProps: _propTypes2.default.object,
  /**
   * Optional props object to be applied to the xAxis
   */
  xAxisProps: _propTypes2.default.object,
  /**
   * Optional props object to be applied to the yAxis
   */
  yAxisProps: _propTypes2.default.object,
  /**
   * Label props for x ticks
   */
  xTickLabelProps: _propTypes2.default.func,
  /**
   * Number of ticks for xAxis
   */
  numXTicks: _propTypes2.default.number,
  /**
   * Number of ticks for yAxis
   */
  numYTicks: _propTypes2.default.number,
  /*
   * A function that recieves `width`, `height`, `xScale`, `yScale`, and `margin` from the `ChartArea` and
   * renders a glyph or series of glyphs with a `z-index` above all chart elements.
   */
  glyphRenderer: _propTypes2.default.function,
  /**
   * A function which formats the xAxis
   */
  formatX: _propTypes2.default.func,
  /**
   * An optional function for the chart viewbox, passed size and margin props
   */
  determineViewBox: _propTypes2.default.func,
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
  nogrid: false,
  notool: false,
  noYAxis: false,
  indicator: _styledComponents.Indicator,
  tooltipRenderer: _styledComponents.defaultTooltipRenderer,
  tooltipContent: _styledComponents.defaultTooltipContent,
  formatY: _formatUtils.formatTicks,
  labelY: '',
  labelX: '',
  numXTicks: 6,
  numYTicks: 4,
  yTickLabelProps: function yTickLabelProps() {
    return {
      dy: '-0.25rem',
      dx: '-0.75rem',
      strokeWidth: '0.5px',
      fontWeight: 400,
      textAnchor: 'end',
      fontSize: 12
    };
  },
  xTickLabelProps: function xTickLabelProps() {
    return {
      dy: '-0.25rem',
      fontWeight: 400,
      strokeWidth: '0.5px',
      textAnchor: 'start',
      fontSize: 12
    };
  },
  labelYProps: { fontSize: 12, textAnchor: 'middle', fill: 'black' },
  labelXProps: { fontSize: 12, textAnchor: 'middle', fill: 'black', dy: '-0.5rem' },
  formatX: _formatUtils.formatXTicks,
  margin: margin
};

exports.default = (0, _withTooltip2.default)((0, _withParentSize2.default)(ChartArea));