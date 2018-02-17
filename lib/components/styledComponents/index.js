var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _templateObject = _taggedTemplateLiteral(['\n  display: block;\n  border: 2px solid ', ';\n  border-radius: 5px;\n  background: #1a2e3c;\n  padding: 8px;\n  > * {\n    margin: 0;\n  }\n'], ['\n  display: block;\n  border: 2px solid ', ';\n  border-radius: 5px;\n  background: #1a2e3c;\n  padding: 8px;\n  > * {\n    margin: 0;\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  height: 16px;\n  width: 16px;\n  margin-top: -0.625rem;\n  z-index: 110;\n  border-right: 2px solid ', ';\n  border-bottom: 2px solid ', ';\n  border-right-bottom-radius: 5px;\n  background: #1a2e3c;\n  transform: rotate(45deg);\n'], ['\n  height: 16px;\n  width: 16px;\n  margin-top: -0.625rem;\n  z-index: 110;\n  border-right: 2px solid ', ';\n  border-bottom: 2px solid ', ';\n  border-right-bottom-radius: 5px;\n  background: #1a2e3c;\n  transform: rotate(45deg);\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  display: flex;\n  position: absolute;\n  top: 0;\n  left: ', ';\n  pointer-events: none;\n  z-index: 1000;\n  flex-direction: column;\n  justify-content: space-around;\n  align-items: center;\n'], ['\n  display: flex;\n  position: absolute;\n  top: 0;\n  left: ', ';\n  pointer-events: none;\n  z-index: 1000;\n  flex-direction: column;\n  justify-content: space-around;\n  align-items: center;\n']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React from 'react';
import styled from 'styled-components';
import { zip } from 'lodash';

import { extractY, parseObject } from 'common/vx/utils/dataUtils';

var TooltipWrapper = styled.div(_templateObject, function (p) {
  return p.theme[p.color] || p.color || p.theme.primaryColor;
});

var Corner = styled.div(_templateObject2, function (p) {
  return p.theme[p.color] || p.color || p.theme.primaryColor;
}, function (p) {
  return p.theme[p.color] || p.color || p.theme.primaryColor;
});

var TooltipContainer = styled.div(_templateObject3, function (p) {
  return p.left - 8.25 + 'px';
});

export var TooltipComponent = function TooltipComponent(_ref) {
  var tooltipData = _ref.tooltipData,
      color = _ref.color,
      left = _ref.left;

  var values = extractY(tooltipData);
  var labels = parseObject(tooltipData, 'string');
  var displayValues = zip([values, labels]);
  return React.createElement(
    TooltipContainer,
    { left: left },
    React.createElement(
      TooltipWrapper,
      { color: color },
      displayValues.map(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            value = _ref3[0],
            label = _ref3[1];

        return React.createElement(
          'p',
          { key: value },
          label + ': ' + value
        );
      })
    ),
    React.createElement(Corner, { color: color, left: left })
  );
};