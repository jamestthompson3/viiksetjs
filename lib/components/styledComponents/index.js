var _templateObject = _taggedTemplateLiteral([''], ['']),
    _templateObject2 = _taggedTemplateLiteral(['\n  display: block;\n  color: #fff;\n  width: 125px;\n  border: 2px solid ', ';\n  border-radius: 5px;\n  background: #1a2e3c;\n  box-shadow: 6px 6px 27px -12px rgba(0, 0, 0, 0.75);\n  padding: 8px;\n  > * {\n    margin: 0;\n    font-size: 12px;\n  }\n'], ['\n  display: block;\n  color: #fff;\n  width: 125px;\n  border: 2px solid ', ';\n  border-radius: 5px;\n  background: #1a2e3c;\n  box-shadow: 6px 6px 27px -12px rgba(0, 0, 0, 0.75);\n  padding: 8px;\n  > * {\n    margin: 0;\n    font-size: 12px;\n  }\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  height: 16px;\n  width: 16px;\n  margin-top: -0.625rem;\n  z-index: 110;\n  border-right: 2px solid ', ';\n  border-bottom: 2px solid ', ';\n  border-right-bottom-radius: 5px;\n  background: #1a2e3c;\n'], ['\n  height: 16px;\n  width: 16px;\n  margin-top: -0.625rem;\n  z-index: 110;\n  border-right: 2px solid ', ';\n  border-bottom: 2px solid ', ';\n  border-right-bottom-radius: 5px;\n  background: #1a2e3c;\n']),
    _templateObject4 = _taggedTemplateLiteral(['\n  display: inline-flex;\n  position: relative;\n  pointer-events: none;\n  z-index: 10000;\n  flex-direction: column;\n  justify-content: space-around;\n  align-items: center;\n'], ['\n  display: inline-flex;\n  position: relative;\n  pointer-events: none;\n  z-index: 10000;\n  flex-direction: column;\n  justify-content: space-around;\n  align-items: center;\n']);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Line } from '@vx/shape';
import { set, get } from 'lodash';
import { withBoundingRects } from '@vx/bounds';
import { LinearGradient } from '@vx/gradient';
import { PatternLines } from '@vx/pattern';
import { GridRows } from '@vx/grid';
import { AreaClosed, LinePath } from '@vx/shape';
import { AxisBottom, AxisLeft, AxisRight } from '@vx/axis';
import { rgba } from 'polished';

var findStroke = function findStroke(p) {
  return p.theme[p.stroke] || p.stroke || p.theme.primaryColor;
};
var findColor = function findColor(p) {
  return p.theme[p.color] || p.color || p.theme.primaryColor;
};
var findFill = function findFill(p) {
  return p.theme[p.color] || p.color || p.theme.primaryColor;
};
var propsColorSetter = function propsColorSetter(p) {
  switch (true) {
    case get(p, 'stroke'):
      return set(p, 'stroke', findStroke(p));
    case get(p, 'fill'):
      return set(p, 'fill', findFill(p));
    case get(p, 'color'):
      return set(p, 'color', findColor(p));
    default:
      return p;
  }
};
export var StyledPoint = styled.circle.attrs({
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
export var StyledLine = styled(Line).attrs({
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
  }
});
export var StyledGridRows = styled(GridRows).attrs({
  pointerEvents: 'none',
  width: function width(p) {
    return p.width;
  },
  stroke: function stroke(p) {
    return findStroke(p);
  }
})(_templateObject);
export var StyledLeftAxis = styled(AxisLeft).attrs({
  strokeWidth: 2,
  numTicks: function numTicks(p) {
    return p.numTicks;
  },
  stroke: function stroke(p) {
    return findColor(p);
  },
  tickLabelProps: function tickLabelProps(p) {
    return function () {
      return propsColorSetter(p.tickLabelProps) || { fill: findColor(p), dx: '-2em' };
    };
  }
})(_templateObject);
export var StyledRightAxis = styled(AxisRight).attrs({
  strokeWidth: 2,
  numTicks: function numTicks(p) {
    return p.numTicks;
  },
  stroke: function stroke(p) {
    return findColor(p);
  },
  tickLabelProps: function tickLabelProps(p) {
    return function () {
      return propsColorSetter(p.tickLabelProps) || { fill: findColor(p), dx: '-2em' };
    };
  }
})(_templateObject);
export var StyledBottomAxis = styled(AxisBottom).attrs({
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
    return function () {
      return {
        fill: findColor(p),
        dy: '-0.25rem',
        fontWeight: '900',
        textAnchor: 'left',
        fontSize: 11
      };
    };
  }
})(_templateObject);
export var StyledGradient = styled(LinearGradient).attrs({
  from: function from(p) {
    return rgba(findColor(p), 0.35);
  },
  to: function to(p) {
    return rgba(findColor(p), 0.05);
  }
})(_templateObject);
export var StyledPatternLines = styled(PatternLines).attrs({
  stroke: function stroke(p) {
    return rgba(findColor(p), 0.15);
  },
  strokeWidth: 1,
  width: 6,
  height: 6,
  orientation: ['diagonal']
})(_templateObject);
export var StyledLinePath = styled(LinePath).attrs({
  data: function data(p) {
    return p.data;
  },
  stroke: function stroke(p) {
    return findColor(p);
  },
  strokeWidth: '1.5px'
})(_templateObject);
export var StyledAreaClosed = styled(AreaClosed).attrs({
  data: function data(p) {
    return p.data;
  },
  stroke: function stroke(p) {
    return findColor(p);
  },
  strokeWidth: 1
})(_templateObject);

export var TooltipWrapper = styled.div(_templateObject2, function (p) {
  return p.color ? p.color : p.theme.primaryColor;
});
export var Corner = styled.div(_templateObject3, function (p) {
  return p.color ? p.color : p.theme.primaryColor;
}, function (p) {
  return p.color ? p.color : p.theme.primaryColor;
});
var TooltipContainer = styled.div.attrs({
  style: function style(_ref) {
    var bounds = _ref.bounds;
    return {
      left: bounds.left + 'px',
      top: bounds.top + 'px'
    };
  }
})(_templateObject4);

var boundsSetter = function boundsSetter(_ref2) {
  var left = _ref2.left,
      rect = _ref2.rect,
      parentRect = _ref2.parentRect;

  if (left + rect.width > parentRect.width) {
    return left - rect.width;
  } else if (left + rect.width < parentRect.left) {
    return left + rect.width / 3;
  } else {
    return left - rect.width / 4; // default case
  }
};
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
  return React.createElement(
    TooltipContainer,
    { bounds: getBounds() },
    children
  );
};

var BoundedTooltip = withBoundingRects(TooltipBucket);

export var withBounds = function withBounds(component) {
  return withBoundingRects(component);
};

export var TooltipComponent = function TooltipComponent(_ref4) {
  var tooltipData = _ref4.tooltipData,
      color = _ref4.color,
      x = _ref4.x;

  return React.createElement(
    BoundedTooltip,
    { left: x },
    React.createElement(
      TooltipWrapper,
      { color: color },
      Object.entries(tooltipData).map(function (entry, i) {
        return React.createElement(
          'p',
          { key: i },
          entry[0] + ': ' + entry[1]
        );
      })
    )
  );
};

export var Indicator = function Indicator(_ref5) {
  var yCoords = _ref5.yCoords,
      x = _ref5.x,
      stroke = _ref5.stroke,
      color = _ref5.color;
  return React.createElement(
    Fragment,
    null,
    React.createElement(Line, {
      from: { x: x, y: 0 },
      to: { x: x, y: Math.max.apply(Math, _toConsumableArray(yCoords)) },
      stroke: stroke,
      strokeWidth: 1,
      strokeOpacity: 0.5,
      style: { pointerEvents: 'none' }
    }),
    yCoords.map(function (coord, i) {
      return React.createElement('circle', {
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