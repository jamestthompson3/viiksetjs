'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Indicator = exports.TooltipComponent = exports.withBounds = exports.TooltipWrapper = exports.StyledAreaClosed = exports.StyledLinePath = exports.StyledPatternLines = exports.StyledGradient = exports.StyledBottomAxis = exports.StyledRightAxis = exports.StyledLeftAxis = exports.StyledGridRows = exports.StyledBar = exports.StyledLine = exports.StyledPoint = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteral([''], ['']),
    _templateObject2 = _taggedTemplateLiteral(['\n  display: block;\n  color: #fff;\n  width: 125px;\n  border: 2px solid ', ';\n  border-radius: 5px;\n  background: #1a2e3c;\n  box-shadow: 6px 6px 27px -12px rgba(0, 0, 0, 0.75);\n  padding: 8px;\n  > * {\n    margin: 0;\n    font-size: 12px;\n  }\n'], ['\n  display: block;\n  color: #fff;\n  width: 125px;\n  border: 2px solid ', ';\n  border-radius: 5px;\n  background: #1a2e3c;\n  box-shadow: 6px 6px 27px -12px rgba(0, 0, 0, 0.75);\n  padding: 8px;\n  > * {\n    margin: 0;\n    font-size: 12px;\n  }\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  display: inline-flex;\n  position: relative;\n  pointer-events: none;\n  z-index: 10000;\n  flex-direction: column;\n  justify-content: space-around;\n  align-items: center;\n'], ['\n  display: inline-flex;\n  position: relative;\n  pointer-events: none;\n  z-index: 10000;\n  flex-direction: column;\n  justify-content: space-around;\n  align-items: center;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _lodash = require('lodash');

var _bounds = require('@vx/bounds');

var _gradient = require('@vx/gradient');

var _pattern = require('@vx/pattern');

var _grid = require('@vx/grid');

var _shape = require('@vx/shape');

var _axis = require('@vx/axis');

var _polished = require('polished');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var findStroke = function findStroke(p) {
  return p.theme[p.stroke] || p.stroke || p.theme.primaryColor;
};
var findColor = function findColor(p) {
  return p.theme[p.color] || p.color || p.theme.primaryColor;
};
var findFill = function findFill(p) {
  return p.theme[p.color] || p.color || p.theme.primaryColor;
};
var propsColorSetter = function propsColorSetter(func, p) {
  var exec = func();
  switch (true) {
    case (0, _lodash.get)(p, 'color') != null:
      return function () {
        return _extends({}, exec, { stroke: findColor(p), fill: findColor(p) });
      };
    case (0, _lodash.get)(p, 'stroke') != null:
      return function () {
        return _extends({}, exec, { stroke: findStroke(p), fill: findStroke(p) });
      };
    default:
      return function () {
        return _extends({}, exec, { stroke: findColor(p), fill: findColor(p) });
      };
  }
};

// FIXME SHOULD BE FOLDED INTO propsColorSetter
var colorSetter = function colorSetter(formatProps, p) {
  switch (true) {
    case (0, _lodash.get)(formatProps, 'color') != null:
      return _extends({}, formatProps, { stroke: findColor(p), fill: findColor(p) });
    case (0, _lodash.get)(formatProps, 'stroke') != null:
      return _extends({}, formatProps, { stroke: findStroke(p), fill: findStroke(p) });
    default:
      return _extends({}, formatProps, { stroke: findColor(p), fill: findColor(p) });
  }
};
var StyledPoint = exports.StyledPoint = _styledComponents2.default.circle.attrs({
  cx: function cx(p) {
    return p.x;
  },
  cy: function cy(p) {
    return p.y;
  },
  stroke: function stroke(p) {
    return findColor(p);
  },
  strokeWidth: 1,
  fillOpacity: function fillOpacity(p) {
    return p.opacity;
  },
  fill: function fill(p) {
    return findColor(p);
  },
  r: function r(p) {
    return p.radius;
  }
})(_templateObject);
var StyledLine = exports.StyledLine = (0, _styledComponents2.default)(_shape.Line).attrs({
  from: function from(p) {
    return p.from;
  },
  to: function to(p) {
    return p.to;
  },
  stroke: function stroke(p) {
    return findColor(p);
  },
  strokeWidth: function strokeWidth(p) {
    return p.width;
  },
  strokeDasharray: function strokeDasharray(p) {
    return p.strokeDasharray;
  }
})(_templateObject);
var StyledBar = exports.StyledBar = (0, _styledComponents2.default)(_shape.Bar).attrs({
  rx: 5,
  ry: 0,
  stroke: function stroke(p) {
    return findColor(p);
  },
  strokeWidth: 1
})(_templateObject);
var StyledGridRows = exports.StyledGridRows = (0, _styledComponents2.default)(_grid.GridRows).attrs({
  pointerEvents: 'none',
  width: function width(p) {
    return p.width;
  },
  stroke: function stroke(p) {
    return findStroke(p);
  }
})(_templateObject);
var StyledLeftAxis = exports.StyledLeftAxis = (0, _styledComponents2.default)(_axis.AxisLeft).attrs({
  strokeWidth: 2,
  numTicks: function numTicks(p) {
    return p.numTicks;
  },
  stroke: function stroke(p) {
    return findColor(p);
  },
  tickLabelProps: function tickLabelProps(p) {
    return propsColorSetter(p.tickLabels, p);
  },
  labelProps: function labelProps(p) {
    return colorSetter(p.labelProps, p);
  }
})(_templateObject);
var StyledRightAxis = exports.StyledRightAxis = (0, _styledComponents2.default)(_axis.AxisRight).attrs({
  strokeWidth: 2,
  numTicks: function numTicks(p) {
    return p.numTicks;
  },
  stroke: function stroke(p) {
    return findColor(p);
  },
  tickLabelProps: function tickLabelProps(p) {
    return propsColorSetter(p.tickLabels, p);
  },
  labelProps: function labelProps(p) {
    return colorSetter(p.labelProps, p);
  }
})(_templateObject);
var StyledBottomAxis = exports.StyledBottomAxis = (0, _styledComponents2.default)(_axis.AxisBottom).attrs({
  top: function top(p) {
    return p.height;
  },
  numTicks: function numTicks(p) {
    return p.numTicks;
  },
  stroke: function stroke(p) {
    return findColor(p);
  },
  tickLabelProps: function tickLabelProps(p) {
    return propsColorSetter(p.tickLabels, p);
  },
  labelProps: function labelProps(p) {
    return colorSetter(p.labelProps, p);
  }
})(_templateObject);
var StyledGradient = exports.StyledGradient = (0, _styledComponents2.default)(_gradient.LinearGradient).attrs({
  from: function from(p) {
    return (0, _polished.rgba)(findColor(p), 0.35);
  },
  to: function to(p) {
    return (0, _polished.rgba)(findColor(p), 0.05);
  }
})(_templateObject);
var StyledPatternLines = exports.StyledPatternLines = (0, _styledComponents2.default)(_pattern.PatternLines).attrs({
  stroke: function stroke(p) {
    return (0, _polished.rgba)(findColor(p), 0.15);
  },
  strokeWidth: 1,
  width: 6,
  height: 6,
  orientation: ['diagonal']
})(_templateObject);
var StyledLinePath = exports.StyledLinePath = (0, _styledComponents2.default)(_shape.LinePath).attrs({
  data: function data(p) {
    return p.data;
  },
  stroke: function stroke(p) {
    return findColor(p);
  },
  strokeWidth: '1.5px'
})(_templateObject);
var StyledAreaClosed = exports.StyledAreaClosed = (0, _styledComponents2.default)(_shape.AreaClosed).attrs({
  data: function data(p) {
    return p.data;
  },
  stroke: function stroke(p) {
    return findColor(p);
  },
  strokeWidth: 1
})(_templateObject);

var TooltipWrapper = exports.TooltipWrapper = _styledComponents2.default.div(_templateObject2, function (p) {
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
})(_templateObject3);

var boundsSetter = function boundsSetter(_ref2) {
  var left = _ref2.left,
      rect = _ref2.rect,
      parentRect = _ref2.parentRect;
  return left - (0, _lodash.get)(rect, 'width', 0) / 4;
};
// if (left + rect.width > parentRect.width) {
//   return left - rect.width / 3 // case for shifting to the right
// } else if (left + rect.width < parentRect.left) {
//   return left + rect.width / 6 // case for shifting to the left
// } else {
//   return left - rect.width / 4 // default case
// }
var TooltipBucket = function TooltipBucket(_ref3) {
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

var BoundedTooltip = (0, _bounds.withBoundingRects)(TooltipBucket);

var withBounds = exports.withBounds = function withBounds(component) {
  return (0, _bounds.withBoundingRects)(component);
};

var TooltipComponent = exports.TooltipComponent = function TooltipComponent(_ref4) {
  var tooltipData = _ref4.tooltipData,
      color = _ref4.color,
      x = _ref4.x;

  return _react2.default.createElement(
    BoundedTooltip,
    { left: x },
    _react2.default.createElement(
      TooltipWrapper,
      { color: color },
      Object.entries(tooltipData).map(function (entry, i) {
        return _react2.default.createElement(
          'p',
          { key: i },
          entry[0] + ': ' + entry[1]
        );
      })
    )
  );
};

var Indicator = exports.Indicator = function Indicator(_ref5) {
  var yCoords = _ref5.yCoords,
      x = _ref5.x,
      stroke = _ref5.stroke,
      color = _ref5.color;
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