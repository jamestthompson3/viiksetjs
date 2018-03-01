var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Children, cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import { withParentSize } from '@vx/responsive';
import { Group } from '@vx/group';

import { Bar } from '@vx/shape';

import { formatTicks, formatXTicks } from '../../utils/formatUtils';
import { biaxial, determineViewBox, determineYScale, barChart } from '../../utils/chartUtils';
import withTooltip from '../Tooltip/withTooltip';
import withStream from '../Streaming/withStream';
import { StyledGridRows, StyledLeftAxis, StyledBottomAxis } from '../styledComponents/index';

var margin = { top: 18, right: 15, bottom: 15, left: 30 };

var StreamableChart = function (_Component) {
  _inherits(StreamableChart, _Component);

  function StreamableChart() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, StreamableChart);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = StreamableChart.__proto__ || Object.getPrototypeOf(StreamableChart)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      chartData: false
    }, _this.calculateData = function () {
      _this.setState({ chartData: false });
      var _this$props = _this.props,
          children = _this$props.children,
          parentHeight = _this$props.parentHeight,
          parentWidth = _this$props.parentWidth,
          xKey = _this$props.xKey,
          yKey = _this$props.yKey,
          type = _this$props.type,
          margin = _this$props.margin,
          connection = _this$props.connection,
          persist = _this$props.persist,
          streamParser = _this$props.streamParser,
          fromStream = _this$props.fromStream;

      if (!connection) {
        console.error('Connection string is needed for StreamableChart');
        return null;
      }
      var biaxialChildren = biaxial(children);
      var width = parentWidth - margin.left - margin.right;
      var height = parentHeight - margin.top - margin.bottom;
      var socket = new window.WebSocket(connection);
      socket.onmessage = function (message) {
        var data = streamParser ? streamParser(message) : message;
        return fromStream(data, biaxialChildren, width, height, xKey, yKey, type, margin, persist);
      };
      _this.setState({
        socket: socket,
        biaxialChildren: biaxialChildren,
        width: width,
        height: height
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(StreamableChart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.calculateData();
      document.addEventListener('resize', this.calculateData());
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var socket = this.state.socket;

      document.removeEventListener('resize', this.calculateData());
      socket && socket.close();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.parentWidth !== this.props.parentWidth || prevProps.parentHeight !== this.props.parentHeight) {
        return this.calculateData();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          biaxialChildren = _state.biaxialChildren,
          width = _state.width,
          height = _state.height;
      var _props = this.props,
          parentHeight = _props.parentHeight,
          parentWidth = _props.parentWidth,
          children = _props.children,
          viewBox = _props.viewBox,
          data = _props.data,
          xScale = _props.xScale,
          yScale = _props.yScale,
          yPoints = _props.yPoints,
          xKey = _props.xKey,
          formatY = _props.formatY,
          formatX = _props.formatX,
          labelY = _props.labelY,
          labelYProps = _props.labelYProps,
          labelX = _props.labelX,
          labelXProps = _props.labelXProps,
          numXTicks = _props.numXTicks,
          numYTicks = _props.numYTicks,
          stroke = _props.stroke,
          nogrid = _props.nogrid,
          color = _props.color;

      return React.createElement(
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
            notool: true,
            yPoints: yPoints,
            width: width,
            mouseMove: _this2.mouseMove,
            mouseLeave: _this2.mouseLeave,
            xKey: xKey,
            inheritedScale: yScale,
            formatY: formatY,
            numYTicks: numYTicks,
            formatX: formatX
          });
        }),
        React.createElement(
          Group,
          { left: margin.left },
          barChart(children) || React.createElement(Bar, { width: width - margin.left, height: height, fill: 'transparent' }),
          !nogrid && React.createElement(StyledGridRows, _extends({ scale: yScale }, { stroke: stroke }, { width: width - margin.left })),
          biaxialChildren || React.createElement(StyledLeftAxis, {
            scale: determineYScale({ type: null, yPoints: yPoints, height: height, margin: margin }),
            color: color,
            numTicks: numYTicks,
            hideTicks: true,
            tickFormat: formatY,
            label: labelY || '',
            labelProps: labelYProps
          })
        ),
        React.createElement(StyledBottomAxis, _extends({
          scale: xScale
        }, { color: color, height: height, margin: margin, numTicks: numXTicks }, {
          hideTicks: true,
          tickFormat: formatX,
          label: labelX || '',
          labelProps: labelXProps
        }))
      );
    }
  }]);

  return StreamableChart;
}(Component);

StreamableChart.propTypes = {
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
  labelY: PropTypes.string,
  /**
   * Label props object for yLabel
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
   * Number of ticks for xAxis
   */
  numXTicks: PropTypes.number,
  /**
   * Number of ticks for yAxis
   */
  numYTicks: PropTypes.number,
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
  persist: 2500,
  color: '#000',
  stroke: '#000',
  nogrid: false,
  formatY: formatTicks,
  labelY: '',
  labelX: '',
  numXTicks: 6,
  numYTicks: 4,
  labelYProps: { fontSize: 12, textAnchor: 'middle', fill: 'black' },
  labelXProps: { fontSize: 12, textAnchor: 'middle', fill: 'black', dy: '-0.5rem' },
  formatX: formatXTicks,
  margin: margin
};

export default withStream(withTooltip(withParentSize(ChartArea)));