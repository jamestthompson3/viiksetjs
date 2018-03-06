var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import Bar from './Bar';
import { stack } from 'd3-shape';

var StackedBar = function (_Component) {
  _inherits(StackedBar, _Component);

  function StackedBar() {
    _classCallCheck(this, StackedBar);

    return _possibleConstructorReturn(this, (StackedBar.__proto__ || Object.getPrototypeOf(StackedBar)).apply(this, arguments));
  }

  _createClass(StackedBar, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(prevProps) {
      return !(prevProps.yPoints === this.props.yPoints) || !(prevProps.dataKey === this.props.dataKey);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          data = _props.data,
          top = _props.top,
          left = _props.left,
          y = _props.y,
          xScale = _props.xScale,
          yScale = _props.yScale,
          zScale = _props.zScale,
          keys = _props.keys,
          height = _props.height;

      var series = stack().keys(keys)(data);
      var format = yScale.tickFormat ? yScale.tickFormat() : function (d) {
        return d;
      };
      var bandwidth = yScale.bandwidth();
      var step = yScale.step();
      var paddingInner = yScale.paddingInner();
      var paddingOuter = yScale.paddingOuter();
      return React.createElement(
        Group,
        { top: top, left: left },
        series && series.map(function (s, i) {
          return React.createElement(
            Group,
            { key: i },
            s.map(function (d, ii) {
              var barWidth = xScale(d[1]) - xScale(d[0]);
              return React.createElement(Bar, _extends({
                key: 'bar-group-bar-' + i + '-' + ii + '-' + s.key,
                x: xScale(d[0]),
                y: yScale(y(d.data)),
                width: barWidth,
                height: bandwidth,
                fill: zScale(s.key),
                data: {
                  bandwidth: bandwidth,
                  paddingInner: paddingInner,
                  paddingOuter: paddingOuter,
                  step: step,
                  key: s.key,
                  value: d[0],
                  height: bandwidth,
                  width: barWidth,
                  y: y(d.data),
                  yFormatted: format(y(d.data)),
                  data: d.data
                }
              }, restProps));
            })
          );
        })
      );
    }
  }]);

  return StackedBar;
}(Component);

StackedBar.propTypes = {
  data: PropTypes.array.isRequired,
  y: PropTypes.func.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  zScale: PropTypes.func.isRequired,
  keys: PropTypes.array.isRequired,
  top: PropTypes.number,
  left: PropTypes.number
};

export default StackedBar;