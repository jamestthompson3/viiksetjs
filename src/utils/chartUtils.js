import { Children } from 'react'
import { Point } from '@vx/point'
import { scaleLinear, scaleTime, scaleBand } from 'd3-scale'

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
    case 'horizontal':
      return scaleLinear()
        .domain([0, Math.max(...xPoints)])
        .range(range)
    default:
      return scaleTime()
        .domain([xPoints[0], xPoints[xPoints.length - 1]])
        .range(range)
  }
}

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
        .range(range)
    default:
      return scaleLinear()
        .domain([0, Math.max(...yPoints)])
        .range(range)
  }
}

/**
 * Determines the viewbox of the chart container based on chart type and manual override
 * @param {String} viewBox - Optional prop passed to chartArea if custom viewbox is wanted
 * @param {Bool} biaxialChildren - Bool based on whether or not the chart has biaxial children
 * @param {Object} margin - Margin object
 * @param {Int} width - Width of parent container
 * @param {Int} height - Height of parent container
 */

export const determineViewBox = (biaxialChildren, margin, width, height) =>
  biaxialChildren ? `-10 0 ${width} ${height}` : `${-margin.left} 0 ${width} ${height}`

/**
 * Takes React Chilren and returns true or false if unique axis Id is found
 * @param {Object} Children - React Children through which it maps
 */
export const biaxial = children =>
  children && Children.map(children, child => child.props.hasOwnProperty('axisId')).includes(true)

/**
 * Takes React Chilren and returns true or false if BarChart element is found
 * @param {Object} Children - React Children through which it maps
 */
export const barChart = children =>
  children && Children.map(children, child => child.type.name === 'BarChart').includes(true)
/**
 * Own implementation of localPoint from VX. Makes it work on Firefox
 * @param {event} event - Event from which to extract svg canvas points
 * @param {node} node - Node from which to base bounding rects on
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
