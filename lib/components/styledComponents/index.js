var _templateObject = _taggedTemplateLiteral([''], ['']),
    _templateObject2 = _taggedTemplateLiteral(['\n  display: block;\n  border: 2px solid ', ';\n  border-radius: 5px;\n  background: #1a2e3c;\n  color: #fff;\n  padding: 8px;\n  > * {\n    margin: 0;\n  }\n'], ['\n  display: block;\n  border: 2px solid ', ';\n  border-radius: 5px;\n  background: #1a2e3c;\n  color: #fff;\n  padding: 8px;\n  > * {\n    margin: 0;\n  }\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  height: 16px;\n  width: 16px;\n  margin-top: -0.625rem;\n  z-index: 110;\n  border-right: 2px solid ', ';\n  border-bottom: 2px solid ', ';\n  border-right-bottom-radius: 5px;\n  background: #1a2e3c;\n  transform: rotate(45deg);\n'], ['\n  height: 16px;\n  width: 16px;\n  margin-top: -0.625rem;\n  z-index: 110;\n  border-right: 2px solid ', ';\n  border-bottom: 2px solid ', ';\n  border-right-bottom-radius: 5px;\n  background: #1a2e3c;\n  transform: rotate(45deg);\n']),
    _templateObject4 = _taggedTemplateLiteral(['\n  display: flex;\n  position: absolute;\n  top: 5rem;\n  width: 125px;\n  left: ', ';\n  pointer-events: none;\n  z-index: 1000;\n  flex-direction: column;\n  justify-content: space-around;\n  align-items: center;\n'], ['\n  display: flex;\n  position: absolute;\n  top: 5rem;\n  width: 125px;\n  left: ', ';\n  pointer-events: none;\n  z-index: 1000;\n  flex-direction: column;\n  justify-content: space-around;\n  align-items: center;\n']);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Line } from '@vx/shape';
import { LinearGradient } from '@vx/gradient';
import { PatternLines } from '@vx/pattern';
import { curveMonotoneX } from '@vx/curve';
import { GridRows } from '@vx/grid';
import { AreaClosed, LinePath } from '@vx/shape';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { rgba } from 'polished';

var findStroke = function findStroke(p) {
  return p.theme[p.stroke] || p.stroke || p.theme.primaryColor;
};
var findColor = function findColor(p) {
  return p.theme[p.color] || p.color || p.theme.primaryColor;
};

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
  numTicks: 4,
  stroke: function stroke(p) {
    return findColor(p);
  },
  tickLabelProps: function tickLabelProps(p) {
    return function () {
      return { fill: findColor(p), dx: '-2em' };
    };
  }
})(_templateObject);
export var StyledBottomAxis = styled(AxisBottom).attrs({
  top: function top(p) {
    return p.height;
  },
  numTicks: 6,
  stroke: function stroke(p) {
    return findColor(p);
  },
  tickLabelProps: function tickLabelProps(p) {
    return function () {
      return { fill: findColor(p), dy: '-0.25rem', fontWeight: '900', textAnchor: 'left', fontSize: 11 };
    };
  }
})(_templateObject);
export var StyledGradient = styled(LinearGradient).attrs({
  from: function from(p) {
    return rgba(findColor(p), 0.35);
  },
  to: function to(p) {
    return rgba(findColor(p), 0.05);
  },
  id: function id(p) {
    return 'gradient' + p.dataKey;
  }
})(_templateObject);
export var StyledPatternLines = styled(PatternLines).attrs({
  stroke: function stroke(p) {
    return rgba(findColor(p), 0.15);
  },
  strokeWidth: 1,
  width: 6,
  height: 6,
  orientation: ['diagonal'],
  id: function id(p) {
    return 'dlines' + p.dataKey;
  }
})(_templateObject);
export var StyledLinePath = styled(LinePath).attrs({
  data: function data(p) {
    return p.data;
  },
  xScale: function xScale(p) {
    return function () {
      return p.xScale;
    };
  },
  yScale: function yScale(p) {
    return function () {
      return p.axisId == null ? p.inheritedScale : p.yScale;
    };
  },
  x: function x(p) {
    return p.xPoints;
  },
  y: function y(p) {
    return p.yPoints;
  },
  curve: function curve(p) {
    return function () {
      return curveMonotoneX;
    };
  },
  stroke: function stroke(p) {
    return findColor(p);
  },
  strokeWidth: '1.5px'
})(_templateObject);

var TooltipWrapper = styled.div(_templateObject2, function (p) {
  return p.theme[p.color] || p.color || p.theme.primaryColor;
});

var Corner = styled.div(_templateObject3, function (p) {
  return p.theme[p.color] || p.color || p.theme.primaryColor;
}, function (p) {
  return p.theme[p.color] || p.color || p.theme.primaryColor;
});

var TooltipContainer = styled.div(_templateObject4, function (p) {
  return p.x + 160 + 'px';
});

export var TooltipComponent = function TooltipComponent(_ref) {
  var tooltipData = _ref.tooltipData,
      color = _ref.color,
      x = _ref.x;

  return React.createElement(
    TooltipContainer,
    { x: x },
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
    ),
    React.createElement(Corner, { color: color })
  );
};

export var Indicator = function Indicator(_ref2) {
  var yCoords = _ref2.yCoords,
      x = _ref2.x,
      stroke = _ref2.stroke,
      color = _ref2.color;
  return React.createElement(
    Fragment,
    null,
    React.createElement(Line, { from: { x: x, y: 0 }, to: { x: x, y: Math.max.apply(Math, _toConsumableArray(yCoords)) }, stroke: stroke, strokeWidth: 1, strokeOpacity: 0.5, style: { pointerEvents: 'none' } }),
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