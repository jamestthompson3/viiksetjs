var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Fragment, Component } from 'react';
import { scaleLinear } from 'd3-scale';
import moment from 'moment';
import PropTypes from 'prop-types';
import { flatten } from 'lodash';

import { StyledPoint } from '../styledComponents';

var ScatterPlot = function (_Component) {
  _inherits(ScatterPlot, _Component);

  function ScatterPlot() {
    _classCallCheck(this, ScatterPlot);

    return _possibleConstructorReturn(this, (ScatterPlot.__proto__ || Object.getPrototypeOf(ScatterPlot)).apply(this, arguments));
  }

  _createClass(ScatterPlot, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(prevProps) {
      return !(this.props.yPoints === prevProps.yPoints) || !(prevProps.dataKey === this.props.dataKey);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          data = _props.data,
          color = _props.color,
          dataKey = _props.dataKey,
          xScale = _props.xScale,
          xKey = _props.xKey,
          nofill = _props.nofill,
          opacity = _props.opacity,
          radius = _props.radius,
          height = _props.height,
          margin = _props.margin,
          nopattern = _props.nopattern,
          inheritedScale = _props.inheritedScale,
          axisId = _props.axisId;
      // Check if data exists

      if (data.map(function (item) {
        return item[dataKey];
      }).includes(undefined)) {
        new ReferenceError('LineChart: No data found with dataKey ' + dataKey);
        return null;
      }
      if (axisId && data.map(function (item) {
        return item[axisId];
      }).includes(undefined)) {
        new ReferenceError('LineChart: No data found with axisId ' + axisId);
        return null;
      }
      var getAxis = function getAxis() {
        return axisId == null ? inheritedScale : yScale;
      };
      var dataPoints = data.map(function (item) {
        return item[dataKey];
      });
      var yPoints = function yPoints(d) {
        return getAxis()(d[dataKey]);
      };
      var xPoints = function xPoints(d) {
        return xScale(xKey ? d[xKey] : flatten(Object.values(d).map(function (value) {
          if (typeof value === 'string') {
            return moment(value);
          }
        })).filter(function (i) {
          return i != null;
        })[0]);
      };
      var yScale = scaleLinear().domain([0, Math.max.apply(Math, _toConsumableArray(dataPoints))]).range([height, margin.top + margin.top]);
      return React.createElement(
        Fragment,
        null,
        data.map(function (d, i) {
          return React.createElement(StyledPoint, {
            key: i,
            x: xPoints(d),
            y: yPoints(d),
            radius: radius,
            opacity: opacity,
            color: color
          });
        })
      );
    }
  }]);

  return ScatterPlot;
}(Component);

ScatterPlot.propTypes = {
  /**
   * Specifies which data points the chart should use to draw itself
   */
  dataKey: PropTypes.string.isRequired,
  /**
   * Specifies the radius of Scatterplot dots
   */
  radius: PropTypes.number,
  /**
   * Optional color prop
   **/
  color: PropTypes.string,
  /**
   * Opacity for points on scatterplot
   **/
  opacity: PropTypes.number
};

ScatterPlot.defaultProps = {
  color: 'rgb(0, 157, 253)',
  opacity: 0.8,
  radius: 8
};
export default ScatterPlot;