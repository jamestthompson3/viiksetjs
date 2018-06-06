'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Indicator = exports.defaultTooltipContent = exports.defaultTooltipRenderer = exports.withBounds = exports.TooltipWrapper = exports.StyledThreshold = exports.StyledPie = exports.StyledAreaClosed = exports.StyledLinePath = exports.StyledGradient = exports.StyledPatternLines = exports.StyledBottomAxis = exports.StyledRightAxis = exports.StyledLeftAxis = exports.StyledGridRows = exports.StyledBar = exports.StyledLine = exports.StyledPoint = exports.StyledText = exports.findColor = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteral(['\n  display: block;\n  color: #fff;\n  border: 2px solid ', ';\n  border-radius: 5px;\n  background: #1a2e3c;\n  box-shadow: 6px 6px 27px -12px rgba(0, 0, 0, 0.75);\n  padding: 8px;\n  > * {\n    margin: 0;\n    font-size: 12px;\n  }\n'], ['\n  display: block;\n  color: #fff;\n  border: 2px solid ', ';\n  border-radius: 5px;\n  background: #1a2e3c;\n  box-shadow: 6px 6px 27px -12px rgba(0, 0, 0, 0.75);\n  padding: 8px;\n  > * {\n    margin: 0;\n    font-size: 12px;\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  display: inline-flex;\n  position: relative;\n  pointer-events: none;\n  z-index: 10000;\n  flex-direction: column;\n  justify-content: space-around;\n  align-items: center;\n'], ['\n  display: inline-flex;\n  position: relative;\n  pointer-events: none;\n  z-index: 10000;\n  flex-direction: column;\n  justify-content: space-around;\n  align-items: center;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _lodash = require('lodash');

var _bounds = require('@vx/bounds');

var _pattern = require('@vx/pattern');

var _gradient = require('@vx/gradient');

var _grid = require('@vx/grid');

var _shape = require('@vx/shape');

var _axis = require('@vx/axis');

var _threshold = require('@vx/threshold');

var _polished = require('polished');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var findStroke = function findStroke(p) {
  return p.theme ? p.theme[p.stroke] || p.stroke || p.theme.primaryColor : p.stroke;
};

var findColor = exports.findColor = function findColor(p) {
  return p.theme ? p.theme[p.color] || p.color || p.theme.primaryColor : p.color;
};

var findFill = function findFill(p) {
  return p.theme ? p.theme[p.fill] || p.fill || p.theme.primaryColor : p.fill;
};

/**
 * Takes a function and returns the another function containing the correct props for axes
 * @param {Function} func - function that returns the current axis props
 * @param {Object} p - props object
 */
var propsColorSetter = function propsColorSetter(func, p, value, index) {
  var exec = func(value, index);
  var combinedProps = _extends({}, exec, p);
  var fill = (0, _lodash.get)(combinedProps, 'fill') ? findFill(combinedProps) : findColor(combinedProps);
  return _extends({}, exec, { fill: fill });
};

/**
 * Takes props from VX components and uses styled-component's theme to return the proper color
 * @param {Object} formatProps - props inherited from visualization component
 * @param {Object} p - props object
 */
var colorSetter = function colorSetter(formatProps, p) {
  switch (true) {
    case (0, _lodash.get)(formatProps, 'color') != null:
      return _extends({}, formatProps, { stroke: findColor(p), fill: findColor(p) });
    case (0, _lodash.get)(formatProps, 'stroke') != null:
      return _extends({}, formatProps, { stroke: findStroke(p), fill: findStroke(p) });
    case (0, _lodash.get)(formatProps, 'fill') != null:
      return _extends({}, formatProps, { stroke: findFill(p), fill: findFill(p) });
    default:
      return _extends({}, formatProps, { stroke: findColor(p), fill: findColor(p) });
  }
};

var StyledText = exports.StyledText = (0, _styledComponents.withTheme)(function (props) {
  return _react2.default.createElement('text', _extends({}, _extends({}, props, { fill: findFill(props) }), { style: { pointerEvents: 'none' } }));
});

var StyledPoint = exports.StyledPoint = (0, _styledComponents.withTheme)(function (props) {
  return _react2.default.createElement('circle', _extends({}, props, {
    r: props.radius,
    stroke: findStroke(props),
    fillOpacity: props.opacity,
    fill: findColor(props)
  }));
});

StyledPoint.defaultProps = {
  strokeWidth: 1
};

var StyledLine = exports.StyledLine = (0, _styledComponents.withTheme)(function (props) {
  return _react2.default.createElement(_shape.Line, _extends({}, props, { strokeWidth: props.width, stroke: findStroke(props) }));
});

var StyledBar = exports.StyledBar = (0, _styledComponents.withTheme)(function (props) {
  return _react2.default.createElement(_shape.Bar, _extends({}, props, { stroke: findColor(props), fill: findFill(props) }));
});

StyledBar.defaultProps = {
  rx: 5,
  ry: 0
};

var StyledGridRows = exports.StyledGridRows = (0, _styledComponents.withTheme)(function (props) {
  return _react2.default.createElement(_grid.GridRows, _extends({}, _extends({}, props, { stroke: findStroke(props) }), { style: { pointerEvents: 'none' } }));
});

var StyledLeftAxis = exports.StyledLeftAxis = (0, _styledComponents.withTheme)(function (props) {
  return _react2.default.createElement(_axis.AxisLeft, _extends({}, props, {
    stroke: findColor(props),
    tickLabelProps: function tickLabelProps(value, index) {
      return propsColorSetter(props.tickLabelProps, props, value, index);
    },
    labelProps: colorSetter(props.labelProps, props)
  }));
});

StyledLeftAxis.defaultProps = {
  strokeWidth: 2,
  tickLabelProps: function tickLabelProps() {
    return { fill: 'black', textAnchor: 'middle', fontSize: 12 };
  }
};

var StyledRightAxis = exports.StyledRightAxis = (0, _styledComponents.withTheme)(function (props) {
  return _react2.default.createElement(_axis.AxisRight, _extends({}, props, {
    stroke: findColor(props),
    tickLabelProps: function tickLabelProps(value, index) {
      return propsColorSetter(props.tickLabelProps, props, value, index);
    },
    labelProps: colorSetter(props.labelProps, props)
  }));
});

StyledRightAxis.defaultProps = {
  strokeWidth: 2,
  tickLabelProps: function tickLabelProps() {
    return { fill: 'black', textAnchor: 'middle', fontSize: 12 };
  }
};

var StyledBottomAxis = exports.StyledBottomAxis = (0, _styledComponents.withTheme)(function (props) {
  return _react2.default.createElement(_axis.AxisBottom, _extends({}, props, {
    stroke: findColor(props),
    tickLabelProps: function tickLabelProps(value, index) {
      return propsColorSetter(props.tickLabelProps, props, value, index);
    },
    top: props.height,
    labelProps: colorSetter(props.labelProps, props)
  }));
});

StyledBottomAxis.defaultProps = {
  tickLabelProps: function tickLabelProps() {
    return { fill: 'black', textAnchor: 'middle', fontSize: 12 };
  }
};
var StyledPatternLines = exports.StyledPatternLines = (0, _styledComponents.withTheme)(function (props) {
  return _react2.default.createElement(_pattern.PatternLines, _extends({}, props, { stroke: (0, _polished.rgba)(findColor(props), props.opacity) }));
});

StyledPatternLines.defaultProps = {
  opacity: 0.15,
  strokeWidth: 1,
  width: 6,
  height: 6,
  orientation: ['diagonal']
};

var StyledGradient = exports.StyledGradient = (0, _styledComponents.withTheme)(function (props) {
  return _react2.default.createElement(_gradient.LinearGradient, _extends({}, props, {
    from: (0, _polished.rgba)(findColor(props), props.start),
    to: (0, _polished.rgba)(findColor(props), props.end)
  }));
});

StyledGradient.defaultProps = {
  start: 0.35,
  end: 0.05
};

var StyledLinePath = exports.StyledLinePath = (0, _styledComponents.withTheme)(function (props) {
  return _react2.default.createElement(_shape.LinePath, _extends({}, props, { stroke: findColor(props) }));
});

StyledLinePath.defaultProps = {
  strokeWidth: '1.5px'
};

var StyledAreaClosed = exports.StyledAreaClosed = (0, _styledComponents.withTheme)(function (props) {
  return _react2.default.createElement(_shape.AreaClosed, _extends({}, props, { stroke: findColor(props) }));
});

StyledAreaClosed.defaultProps = {
  strokeWidth: 1
};

var StyledPie = exports.StyledPie = (0, _styledComponents.withTheme)(function (props) {
  return _react2.default.createElement(_shape.Pie, _extends({}, props, { fill: findColor(props) }));
});

var StyledThreshold = exports.StyledThreshold = (0, _styledComponents.withTheme)(function (props) {
  return _react2.default.createElement(_threshold.Threshold, _extends({}, props, {
    belowAreaProps: colorSetter(props.belowAreaProps, props),
    aboveAreaProps: colorSetter(props.aboveAreaProps, props)
  }));
});

var TooltipWrapper = exports.TooltipWrapper = _styledComponents2.default.div(_templateObject, function (p) {
  return p.color || p.theme.primaryColor;
});
var TooltipContainer = _styledComponents2.default.div.attrs({
  style: function style(_ref) {
    var bounds = _ref.bounds;

    return {
      left: bounds.left + 'px',
      top: bounds.top + 'px'
    };
  }
})(_templateObject2);

var boundsSetter = function boundsSetter(_ref2) {
  var left = _ref2.left,
      rect = _ref2.rect,
      parentRect = _ref2.parentRect;

  if (left + rect.width > parentRect.width) {
    return left - rect.width; // case for shifting to the right
  } else if (rect.width / 3 == parentRect.left) {
    return rect.width; // FIXME case for shifting to the left
  } else {
    return left - rect.width / 2.5; // default case
  }
};

/**
 * TooltipBounder sets bounds for the tooltip and passes them down
 * @param {ReactElement} children - children to be rendered
 * @param {Function} getRects - function for calcuating the bounding rects of the tooltip
 * @param {Number} left - x coordinate of the mouse
 */
var TooltipBounder = function TooltipBounder(_ref3) {
  var children = _ref3.children,
      getRects = _ref3.getRects,
      left = _ref3.left;

  var _getRects = getRects(),
      rect = _getRects.rect,
      parentRect = _getRects.parentRect;

  var getBounds = function getBounds() {
    if (rect && parentRect) {
      return {
        left: boundsSetter({ left: left, rect: rect, parentRect: parentRect }),
        top: -parentRect.height - rect.height
      };
    }
    return {
      left: left,
      top: 0
    };
  };
  return _react2.default.createElement(
    TooltipContainer,
    { bounds: getBounds() },
    children
  );
};

var BoundedTooltip = (0, _bounds.withBoundingRects)(TooltipBounder);

/**
 * Wraps a React component and passes the `getRects` function,
 * allowing the wrapped component to have access to both its own bounding rect
 * and the it's parent's bouding rect
 * @param {ReactElement} component
 */
var withBounds = exports.withBounds = function withBounds(component) {
  return (0, _bounds.withBoundingRects)(component);
};

/**
 * Wrapper component for default tooltip
 * @param {Object} tooltipData - data calculated from ChartArea
 * @param {String} color - color from ChartArea
 * @param {Number} x - svg x coordinate
 * @param {ReactElement} tooltipContent - prop passed from user
 */
var defaultTooltipRenderer = exports.defaultTooltipRenderer = function defaultTooltipRenderer(_ref4) {
  var tooltipData = _ref4.tooltipData,
      tooltipContent = _ref4.tooltipContent,
      color = _ref4.color,
      x = _ref4.x;
  return _react2.default.createElement(
    BoundedTooltip,
    { left: x },
    _react2.default.createElement(
      TooltipWrapper,
      { color: color },
      tooltipContent({ tooltipData: tooltipData })
    )
  );
};

/**
 * Default tooltip content function
 * @param {Object} tooltipData - tooltipData
 * @returns {ReactElement} tooltipContent
 */
var defaultTooltipContent = exports.defaultTooltipContent = function defaultTooltipContent(_ref5) {
  var tooltipData = _ref5.tooltipData;
  return Object.entries(tooltipData).map(function (entry, i) {
    return _react2.default.createElement(
      'p',
      { key: i },
      entry[0] + ': ' + entry[1]
    );
  });
};

var Indicator = exports.Indicator = function Indicator(_ref6) {
  var yCoords = _ref6.yCoords,
      x = _ref6.x,
      stroke = _ref6.stroke,
      color = _ref6.color;

  return _react2.default.createElement(
    _react.Fragment,
    null,
    _react2.default.createElement(_shape.Line, {
      from: { x: x, y: 0 },
      to: { x: x, y: Math.max.apply(Math, _toConsumableArray(yCoords)) },
      stroke: stroke,
      strokeWidth: 1,
      strokeOpacity: 0.5,
      style: { pointerEvents: 'none' }
    }),
    yCoords.map(function (coord, i) {
      return _react2.default.createElement('circle', {
        key: i,
        cx: x,
        cy: coord,
        fill: 'rgb(28, 42, 44)',
        stroke: color,
        strokeWidth: 1,
        style: { pointerEvents: 'none' },
        fillOpacity: 1,
        r: 4
      });
    })
  );
};