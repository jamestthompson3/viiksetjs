var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';

import { getX, getY } from '../../utils/dataUtils';
import { determineXScale, determineYScale } from '../../utils/chartUtils';
import { uniq } from 'lodash';
import moment from 'moment';

export var withStreamPropTypes = {
  streamData: PropTypes.object
};

export default function withStream(BaseComponent) {
  var WrappedComponent = function (_React$PureComponent) {
    _inherits(WrappedComponent, _React$PureComponent);

    function WrappedComponent() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, WrappedComponent);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = WrappedComponent.__proto__ || Object.getPrototypeOf(WrappedComponent)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        data: null,
        yScale: null,
        xScale: null,
        yPoints: null
      }, _this.fromStream = function (data, children, parentHeight, parentWidth, xKey, yKey, type, margin, persist) {
        var width = parentWidth - margin.left - margin.right;
        var height = parentHeight - margin.top - margin.bottom;
        var xPoints = uniq(getX(data, xKey)).map(function (datum) {
          return typeof datum === 'string' && moment(datum).isValid() ? moment(datum).toDate() : datum;
        });
        var yPoints = getY(data, yKey);
        var yScale = determineYScale({ type: type, yPoints: yPoints, height: height, margin: margin });
        var xScale = determineXScale({ type: type, width: width, xPoints: xPoints, margin: margin });
        return _this.setState(function (s) {
          return {
            data: s.data.length <= persist ? [].concat(_toConsumableArray(s.data), [data]) : [].concat(_toConsumableArray(s.data.slice(1)), [data]),
            yPoints: yPoints,
            yScale: yScale,
            xScale: xScale
          };
        });
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(WrappedComponent, [{
      key: 'render',
      value: function render() {
        return React.createElement(BaseComponent, _extends({ fromStream: this.fromStream }, this.state, this.props));
      }
    }]);

    return WrappedComponent;
  }(React.PureComponent);

  return WrappedComponent;
}