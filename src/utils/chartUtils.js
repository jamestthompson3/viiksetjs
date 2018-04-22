import { Children } from 'react'
import { Point } from '@vx/point'
import { scaleLinear, scaleTime, scaleBand } from 'd3-scale'
import moment from 'moment'

/**
 * Determines the xScale of the chart based on chart type
 * @param {String} type - Type of chart
 * @param {Number[]} xPoints - array of xPoints
 * @param {Number} height - height of ChartArea
 * @param {Object} margin - margin passed to ChartArea
 * @returns {Object} xScale - xScale
 */
export const determineXScale = ({ type, xPoints, width, margin }) => {
  const range = [margin.left, width]
  switch (type) {
    case 'ordinal':
      return scaleBand()
        .domain(xPoints)
        .range(range)
        .padding(0.1)
    case 'linear':
      return scaleLinear()
        .domain([xPoints[0], xPoints[xPoints.length - 1]])
        .range(range)
    default:
      return scaleTime()
        .domain([xPoints[0], xPoints[xPoints.length - 1]])
        .range(range)
  }
}

/**
 * Determines the yScale of the chart based on chart type
 * @param {String} type - Type of chart
 * @param {Number[]} yPoints - array of yPoints
 * @param {Number} height - height of ChartArea
 * @param {Object} margin - margin passed to ChartArea
 * @returns {Object} yScale - yScale
 */
export const determineYScale = ({ type, yPoints, height, margin }) => {
  const range = [height, margin.top]
  switch (type) {
    case 'ordinal':
      return scaleLinear()
        .domain([Math.max(...yPoints), 0])
        .range(range)
    case 'horizontal':
      return scaleBand()
        .domain(yPoints)
        .range([height, margin.top])
        .padding(0.1)
    default:
      return scaleLinear()
        .domain([0, Math.max(...yPoints)])
        .range(range)
  }
}

export const findTooltipX = ({ type, calculatedX, xScale }) => {
  switch (type) {
    case 'ordinal':
    case 'linear':
      return xScale(calculatedX)
    default:
      return xScale(moment(calculatedX))
  }
}

/**
 * Takes React Chilren and returns true or false if unique axis Id is found
 * @param {Object} Children - React Children through which it maps
 * @returns {Boolean} - Indicates whether the chart should be biaxial
 */
export const biaxial = children =>
  children && Children.map(children, child => child.props.hasOwnProperty('axisId')).includes(true)

/**
 * Own implementation of localPoint from VX. Makes it work on Firefox
 * @param {event} event - Event from which to extract svg canvas points
 * @param {node} node - Node from which to base bounding rects on
 * @returns {Object} point - Point object
 */
export function localPoint(node, event) {
  // called with no args
  if (!node) return

  // called with localPoint(event)
  if (node.target) {
    event = node

    // set node to targets owner svg
    node = event.target.ownerSVGElement

    // find the outermost svg
    while (node.ownerSVGElement) {
      node = node.ownerSVGElement
    }
  }

  // default to mouse event
  let { clientX, clientY } = event

  // support touch event
  if (event.changedTouches) {
    clientX = event.changedTouches[0].clientX
    clientY = event.changedTouches[0].clientY
  }

  // FF workaround
  if (navigator.userAgent.includes('Firefox')) {
    const rect = node.getBoundingClientRect()
    return new Point({
      x: clientX - rect.left - node.clientLeft,
      y: clientY - rect.top - node.clientTop
    })
  }
  // calculate coordinates from svg
  node.createSVGPoint
  let point = node.createSVGPoint()
  point.x = clientX
  point.y = clientY
  point = point.matrixTransform(node.getScreenCTM().inverse())

  return new Point({
    x: point.x,
    y: point.y
  })
}
