var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Children, cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';

import { formatTicks, formatXTicks } from '../../utils/formatUtils';
import { biaxial, determineViewBox, determineYScale } from '../../utils/chartUtils';
import withStream from '../Streaming/withStream';
import withParentSize from '../Responsive/withParentSize';
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
      socket: null
    }, _this.calculateData = function () {
      var _this$props = _this.props,
          children = _this$props.children,
          size = _this$props.size,
          xKey = _this$props.xKey,
          yKey = _this$props.yKey,
          type = _this$props.type,
          margin = _this$props.margin,
          mapStream = _this$props.mapStream,
          persist = _this$props.persist,
          streamParser = _this$props.streamParser,
          fromStream = _this$props.fromStream;

      var biaxialChildren = biaxial(children);
      var width = size.width - margin.left - margin.right;
      var height = size.height - margin.top - margin.bottom;
      _this.socket.onclose = function () {
        return console.log('connection closed');
      };
      _this.socket.onmessage = function (message) {
        return fromStream({
          message: streamParser(message),
          biaxialChildren: biaxialChildren,
          mapStream: mapStream,
          width: width,
          height: height,
          xKey: xKey,
          yKey: yKey,
          type: type,
          margin: margin,
          persist: persist
        });
      };
      _this.setState({
        biaxialChildren: biaxialChildren,
        width: width,
        height: height
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(StreamableChart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var connection = this.props.connection;

      if (!connection) {
        // eslint-disable-next-line
        console.error('Connection string is needed for StreamableChart');
        return null;
      }
      this.socket = new window.WebSocket(connection);
      this.calculateData();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.socket.close();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var _props = this.props,
          stopPersist = _props.stopPersist,
          data = _props.data;

      if (stopPersist && data.length >= stopPersist) {
        this.socket.close();
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
      var _props2 = this.props,
          size = _props2.size,
          children = _props2.children,
          viewBox = _props2.viewBox,
          data = _props2.data,
          xScale = _props2.xScale,
          yScale = _props2.yScale,
          yPoints = _props2.yPoints,
          xKey = _props2.xKey,
          formatY = _props2.formatY,
          formatX = _props2.formatX,
          labelY = _props2.labelY,
          labelYProps = _props2.labelYProps,
          labelX = _props2.labelX,
          labelXProps = _props2.labelXProps,
          numXTicks = _props2.numXTicks,
          numYTicks = _props2.numYTicks,
          stroke = _props2.stroke,
          nogrid = _props2.nogrid,
          chartData = _props2.chartData,
          color = _props2.color;

      return !chartData ? React.createElement(
        'h2',
        null,
        'waiting on connection'
      ) : React.createElement(
        'svg',
        {
          width: size.width,
          height: size.height,
          preserveAspectRatio: 'none',
          viewBox: viewBox ? viewBox : determineViewBox(biaxialChildren, margin, size.width, size.height),
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
  /**
   * If the data array reaches this limit, the connection will close
   */
  stopPersist: PropTypes.number,
  /**
   * If the data array reaches this limit, values will be popped from the beginning  of the array
   */
  persist: PropTypes.number,
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
   * An optional prop for chart margins
   */
  margin: PropTypes.object
};

StreamableChart.defaultProps = {
  data: [],
  persist: 2500,
  color: '#000',
  stroke: '#000',
  nogrid: false,
  formatY: formatTicks,
  streamParser: function streamParser(message) {
    return message;
  },
  mapStream: function mapStream(data, message) {
    return [].concat(_toConsumableArray(data), [message]);
  },
  labelY: '',
  labelX: '',
  numXTicks: 6,
  numYTicks: 4,
  labelYProps: { fontSize: 12, textAnchor: 'middle', fill: 'black' },
  labelXProps: { fontSize: 12, textAnchor: 'middle', fill: 'black', dy: '-0.5rem' },
  formatX: formatXTicks,
  margin: margin
};

export default withStream(withParentSize(StreamableChart));