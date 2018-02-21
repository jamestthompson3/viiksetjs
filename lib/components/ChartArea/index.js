var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Children, cloneElement, Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { withParentSize } from '@vx/responsive';
import { Group } from '@vx/group';

import { Bar } from '@vx/shape';
import { scaleLinear } from 'd3-scale';
import { bisect } from 'd3-array';
import moment from 'moment';
import { flow, uniq, head, isEmpty } from 'lodash';

import { getX, getY, extractLabels, extractX, extractY, createScalarData } from '../../utils/dataUtils';
import { formatTicks, formatXTicks } from '../../utils/formatUtils';
import { determineScale, biaxial, localPoint, determineViewBox } from '../../utils/chartUtils';
import withTooltip from '../Tooltip/withTooltip';
import { TooltipComponent, Indicator, StyledGridRows, StyledLeftAxis, StyledBottomAxis } from '../styledComponents/index';

var margin = { top: 18, right: 15, bottom: 0, left: 30 };

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
          parentHeight = _this$props.parentHeight,
          parentWidth = _this$props.parentWidth,
          xKey = _this$props.xKey,
          yKey = _this$props.yKey,
          type = _this$props.type,
          margin = _this$props.margin;

      if (isEmpty(data)) {
        console.error('Data is empty, cannot calculate chart');
        return null;
      }
      var biaxialChildren = biaxial(children);
      var dataKeys = extractLabels(data[0]);
      var width = parentWidth - margin.left - margin.right;
      var height = parentHeight - margin.top - margin.bottom;
      var xPoints = uniq(getX(data, xKey)).map(function (datum) {
        return moment(datum).isValid() ? moment(datum).toDate() : datum;
      });
      var yPoints = getY(data, yKey);
      var yScale = scaleLinear().domain([0, Math.max.apply(Math, _toConsumableArray(yPoints))]).range([height, margin.top]);
      var yScales = biaxialChildren ? createScalarData(data, dataKeys, height, margin) : null;
      var xScale = determineScale({ type: type, width: width, xPoints: xPoints, margin: margin });
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
      var event = _ref2.event;
      var _this$state = _this.state,
          xPoints = _this$state.xPoints,
          xScale = _this$state.xScale,
          yScale = _this$state.yScale,
          yScales = _this$state.yScales,
          dataKeys = _this$state.dataKeys;
      var _this$props2 = _this.props,
          data = _this$props2.data,
          updateTooltip = _this$props2.updateTooltip;

      var svgPoint = localPoint(_this.chart, event).x;
      var xValue = xScale.invert(svgPoint);
      flow(function (xValue) {
        return bisect(xPoints, xValue);
      }, function (index) {
        var bounds = { dLeft: data[index - 1], dRight: data[index] };
        return xValue - xPoints[index - 1] > xPoints[index] - xValue ? bounds.dRight || bounds.dLeft : bounds.dLeft || bounds.dRight;
      }, function (calculatedData) {
        var x = xScale(moment(head(extractX(calculatedData))));
        var yCoords = yScales ? dataKeys.map(function (key) {
          return yScales[key](calculatedData[key]);
        }) : extractY(calculatedData).map(function (item) {
          return yScale(item);
        });
        return updateTooltip({ calculatedData: calculatedData, x: x, mouseX: svgPoint, yCoords: yCoords });
      })(xValue);
    }, _this.mouseLeave = function () {
      return _this.props.updateTooltip({ calculatedData: null, x: null, yCoords: null });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ChartArea, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.calculateData();
      document.addEventListener('resize', this.calculateData());
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('resize', this.calculateData());
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.data !== this.props.data || prevProps.parentWidth !== this.props.parentWidth || prevProps.parentHeight !== this.props.parentHeight) {
        return this.calculateData();
      }
    }
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
          yPoints = _state.yPoints;
      var _props = this.props,
          parentHeight = _props.parentHeight,
          parentWidth = _props.parentWidth,
          children = _props.children,
          viewBox = _props.viewBox,
          data = _props.data,
          xKey = _props.xKey,
          formatY = _props.formatY,
          formatX = _props.formatX,
          labelY = _props.labelY,
          labelYProps = _props.labelYProps,
          labelX = _props.labelX,
          labelXProps = _props.labelXProps,
          stroke = _props.stroke,
          nogrid = _props.nogrid,
          notool = _props.notool,
          color = _props.color,
          yCoords = _props.yCoords,
          calculatedData = _props.calculatedData,
          Tooltip = _props.tooltip,
          Indicator = _props.indicator,
          mouseX = _props.mouseX,
          x = _props.x;

      return chartData && React.createElement(
        Fragment,
        null,
        React.createElement(
          'svg',
          {
            width: parentWidth,
            height: parentHeight,
            preserveAspectRatio: 'none',
            viewBox: viewBox ? viewBox : determineViewBox({ biaxialChildren: biaxialChildren, margin: margin, parentWidth: parentWidth, parentHeight: parentHeight }),
            ref: function ref(svg) {
              return _this2.chart = svg;
            }
          },
          Children.map(children, function (child) {
            return cloneElement(child, {
              data: data,
              xScale: xScale,
              margin: margin,
              height: height,
              chartData: chartData,
              yPoints: yPoints,
              width: width,
              xKey: xKey,
              inheritedScale: yScale,
              formatY: formatY,
              formatX: formatX
            });
          }),
          React.createElement(
            Group,
            { left: margin.left },
            React.createElement(Bar, {
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
            !nogrid && React.createElement(StyledGridRows, _extends({ scale: yScale }, { stroke: stroke }, { width: width - margin.left })),
            biaxialChildren || React.createElement(StyledLeftAxis, {
              scale: yScale,
              color: color,
              hideTicks: true,
              tickFormat: formatY,
              label: labelY || '',
              labelProps: labelYProps
            })
          ),
          React.createElement(StyledBottomAxis, _extends({
            scale: xScale
          }, { color: color, height: height }, {
            hideTicks: true,
            tickFormat: formatX,
            label: labelX || '',
            labelProps: labelXProps
          })),
          x && React.createElement(Indicator, { yCoords: yCoords, x: x, stroke: stroke, color: color, height: height, mouseX: mouseX })
        ),
        x && React.createElement(Tooltip, _extends({ tooltipData: calculatedData }, { x: x, color: color, yCoords: yCoords, mouseX: mouseX }))
      );
    }
  }]);

  return ChartArea;
}(Component);

ChartArea.propTypes = {
  data: PropTypes.array.isRequired,
  /**
   * Optional prop to apply color axes and x-ticks
   */
  color: PropTypes.string,
  /**
   * Optional prop to apply color gridlines
   */
  stroke: PropTypes.string,
  /**
   * A string indicating the type of scale the type should have, defaults to timeseries
   */
  type: PropTypes.oneOf(['ordinal', 'linear']),
  /**
   * A string indicating which data values should be used to create the x-axis
   */
  xKey: PropTypes.string,
  /**
   * A React component to return as a tooltip
   */
  tooltip: PropTypes.func,
  /**
   * A React component made with SVG to indicate the tooltip position
   */
  indicator: PropTypes.func,
  /**
   * A function which formats the yAxis
   */
  formatY: PropTypes.func,
  /**
   * A label for the yAxis
   */
  labelY: PropTypes.string,
  /**
   * Label props object for yLabel
   */
  labelYProps: PropTypes.object,
  /**
   * A label for the xAxis
   */
  labelX: PropTypes.string,
  /**
   * Label props object for xLabel
   */
  labelXProps: PropTypes.object,
  /**
   * A function which formats the xAxis
   */
  formatX: PropTypes.func,
  /**
   * An optional string for the chart viewbox
   */
  viewBox: PropTypes.string,
  /**
   * If true, no gridlines will be shown.
   */
  nogrid: PropTypes.bool,
  /**
   * If true, no tooltip will be shown.
   */
  notool: PropTypes.bool,
  /**
   * An optional prop for chart margins
   */
  margin: PropTypes.object
};

ChartArea.defaultProps = {
  data: [],
  color: '#000',
  stroke: '#000',
  tooltip: TooltipComponent,
  nogrid: false,
  indicator: Indicator,
  formatY: formatTicks,
  labelY: '',
  labelX: '',
  labelYProps: { fontSize: 12, textAnchor: 'middle', fill: 'black' },
  labelXProps: { fontSize: 12, textAnchor: 'middle', fill: 'black' },
  formatX: formatXTicks,
  margin: margin
};

export default withTooltip(withParentSize(ChartArea));