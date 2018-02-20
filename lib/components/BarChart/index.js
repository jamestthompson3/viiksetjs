function _objectWithoutProperties(obj, keys) {
  var target = {}
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
    target[i] = obj[i]
  }
  return target
}

import React, { Fragment } from 'react'
import { LinearGradient } from '@vx/gradient'
import { Bar } from '@vx/shape'
import PropTypes from 'prop-types'
import { rgba } from 'polished'

var BarChart = function BarChart(_ref) {
  var data = _ref.data,
    color = _ref.color,
    dataKey = _ref.dataKey,
    xScale = _ref.xScale,
    xKey = _ref.xKey,
    margin = _ref.margin,
    height = _ref.height,
    fill = _ref.fill,
    inheritedScale = _ref.inheritedScale,
    rest = _objectWithoutProperties(_ref, [
      'data',
      'color',
      'dataKey',
      'xScale',
      'xKey',
      'margin',
      'height',
      'fill',
      'inheritedScale'
    ])

  if (
    data
      .map(function(item) {
        return item[dataKey]
      })
      .includes(undefined)
  ) {
    new ReferenceError('BarChart: No data found with dataKey ' + dataKey)
    return null
  }
  var xPoint = function xPoint(d) {
    return xScale(d[xKey])
  }
  var barHeight = function barHeight(d) {
    return inheritedScale(d[dataKey])
  }
  return React.createElement(
    Fragment,
    null,
    React.createElement(LinearGradient, {
      from: rgba(color, 0.35),
      to: rgba(color, 0.05),
      id: 'gradient' + xKey
    }),
    data.map(function(d, i) {
      return React.createElement(Bar, {
        width: xScale.bandwidth(),
        key: i,
        height: barHeight(d),
        x: xPoint(d),
        y: height - barHeight(d),
        rx: 5,
        ry: 0,
        fill: fill && 'url(#gradient' + xKey + ')',
        stroke: color,
        strokeWidth: 1
      })
    })
  )
}

BarChart.propTypes = {
  /**
   * Indicates which data column should draw the BarChart
   */
  dataKey: PropTypes.string.isRequired,
  /**
   * Indicates the color of the BarChart
   */
  color: PropTypes.string
}

BarChart.defaultProps = {
  color: 'rgb(0, 157, 253)',
  fill: true
}
export default BarChart
