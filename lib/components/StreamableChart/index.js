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

var _formatUtils = require('../../utils/formatUtils');

var _chartUtils = require('../../utils/chartUtils');

var _withStream = require('../Streaming/withStream');

var _withStream2 = _interopRequireDefault(_withStream);

var _withParentSize = require('../Responsive/withParentSize');

var _withParentSize2 = _interopRequireDefault(_withParentSize);

var _index = require('../styledComponents/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

      var biaxialChildren = (0, _chartUtils.biaxial)(children);
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
          type = _props2.type,
          labelYProps = _props2.labelYProps,
          labelX = _props2.labelX,
          labelXProps = _props2.labelXProps,
          xTickLabelProps = _props2.xTickLabelProps,
          yTickLabelProps = _props2.yTickLabelProps,
          numXTicks = _props2.numXTicks,
          numYTicks = _props2.numYTicks,
          stroke = _props2.stroke,
          nogrid = _props2.nogrid,
          noYAxis = _props2.noYAxis,
          chartData = _props2.chartData,
          color = _props2.color;

      return !chartData ? _react2.default.createElement(
        'h2',
        null,
        'waiting on connection'
      ) : _react2.default.createElement(
        'svg',
        {
          width: size.width,
          height: size.height,
          preserveAspectRatio: 'none',
          viewBox: viewBox ? viewBox : (0, _chartUtils.determineViewBox)(biaxialChildren, margin, size.width, size.height),
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
        _react2.default.createElement(
          _group.Group,
          { left: margin.left },
          !nogrid && _react2.default.createElement(_index.StyledGridRows, _extends({ scale: yScale }, { stroke: stroke }, { width: width - margin.left })),
          biaxialChildren || noYAxis || _react2.default.createElement(_index.StyledLeftAxis, _extends({
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
          scale: xScale
        }, { color: color, height: height, margin: margin, numTicks: numXTicks, tickLabels: xTickLabelProps }, {
          hideTicks: true,
          tickFormat: formatX,
          label: labelX || '',
          labelProps: labelXProps
        }))
      );
    }
  }]);

  return StreamableChart;
}(_react.Component);

StreamableChart.propTypes = {
  /**
   * If the data array reaches this limit, the connection will close
   */
  stopPersist: _propTypes2.default.number,
  /**
   * If the data array reaches this limit, values will be popped from the beginning  of the array
   */
  persist: _propTypes2.default.number,
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
  type: _propTypes2.default.oneOf(['ordinal', 'linear', 'horizontal']),
  /**
   * A string indicating which data values should be used to create the x-axis
   */
  xKey: _propTypes2.default.string,
  /**
   * A function which formats the yAxis
   */
  formatY: _propTypes2.default.func,
  /**
   * A label for the yAxis
   */
  labelY: _propTypes2.default.string,
  /**
   * Label props object for yLabel
   */
  labelYProps: _propTypes2.default.func,
  /**
   * Label props object for yTicks
   */
  yTickLabelProps: _propTypes2.default.func,
  /**
   * Label props object for xTicks
   */
  xTickLabelProps: _propTypes2.default.func,
  /**
   * A label for the xAxis
   */
  labelX: _propTypes2.default.string,
  /**
   * Label props object for xLabel
   */
  labelXProps: _propTypes2.default.func,
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
   * An optional prop for chart margins
   */
  margin: _propTypes2.default.object
};

StreamableChart.defaultProps = {
  data: [],
  persist: 2500,
  color: '#000',
  stroke: '#000',
  nogrid: false,
  noYAxis: false,
  formatY: _formatUtils.formatTicks,
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
  labelYProps: function labelYProps() {
    return { fontSize: 12, textAnchor: 'middle', fill: 'black' };
  },
  labelXProps: function labelXProps() {
    return { fontSize: 12, textAnchor: 'middle', fill: 'black', dy: '-0.5rem' };
  },
  yTickLabelProps: function yTickLabelProps() {
    return {
      dy: '-0.25rem',
      dx: '-1.75rem',
      strokeWidth: '0.5px',
      fontWeight: '400',
      textAnchor: 'left',
      fontSize: 12
    };
  },
  xTickLabelProps: function xTickLabelProps() {
    return {
      dy: '-0.25rem',
      fontWeight: '400',
      strokeWidth: '0.5px',
      textAnchor: 'left',
      fontSize: 12
    };
  },
  formatX: _formatUtils.formatXTicks,
  margin: margin
};

exports.default = (0, _withStream2.default)((0, _withParentSize2.default)(StreamableChart));