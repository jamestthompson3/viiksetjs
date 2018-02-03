import { scaleLinear } from 'd3-scale'
import { flatten } from 'lodash'
import { Children } from 'react'
import { Point } from '@vx/point'

/**
 * Takes an object and arguement and returns the values of the object according to the argument type
 * @param {Object} object - object which you wish to parse
 * @param {String} arg - one of the javascript types for variables
 */
export const parseObject = (object, arg) => object != null && Object.values(object)
  .map(value => typeof value === arg ? value : null)
  .filter(s => s != null)

/**
* Takes an array of objects and a datakey and returns an array of x-value points
* @param {Object[]} data - an array of data objects
* @param {String} xKey - a key for the xvalues, if they cannot be found by looking at the object itself
*/
export const getX = (data, xKey) => xKey ? data.map(datum => datum[xKey]) : flatten(data.map(datum => parseObject(datum, 'string'))).filter(i => i != null)

/**
* Takes an array of objects and returns an array of y-value points
* @param {Object[]} data - an array of data objects
* @param {String} yKey - a key for the yvalue, if not using categorical or timeseries data
*/
export const getY = (data, yKey) => yKey ? data.map(datum => datum[yKey]) : flatten(data.map(datum => parseObject(datum, 'number'))).filter(i => i != null)

/**
 * Takes a data object and extracts all Y values
 * @param {Object} datum - the object which you want to extract the values from
 * @param {String} yKey - a key for the yvalue, if not using categorical or timeseries data
 */
export const extractY = (datum, yKey) => yKey ? [datum[yKey]] : flatten(parseObject(datum, 'number')).filter(i => i != null)

/**
 * Takes a data object and extracts all X values
 * @param {Object} datum - the object which you want to extract the values from
 * @param {String} xKey - a key for the xvalue, if not using categorical or timeseries data
 */
export const extractX = (datum, xKey) => xKey ? [datum[xKey]] : flatten(parseObject(datum, 'string')).filter(i => i != null)

/**
 * Takes a data object and extracts all Y labels
 * @param {Object} datum - the object which you want to extract the labels from
 */
export const extractLabels = datum => flatten(Object.entries(datum).map(value => {
  if (typeof value[1] === 'number') {
    return value[0]
  }
})).filter(i => i != null)


/**
 * Takes four parameters and produces and object with a scale for each column
 * in the dataset
 * @param {Object[]} data - an array of data objects
 * @param {Object[]} dataKeys - the keys or column names of the data objects
 * @param {Number} height - the height of the svg container
 * @param {Object} margin - the margin object used in the chartArea
 */
export const createScalarData = (data, dataKeys, height, margin ) => {
  const scalarObject = {}
  dataKeys.map(key => (
    scalarObject[key] = scaleLinear()
      .domain([
        0,
        Math.max(...data.map(item => {
          if (!item[key]) {
            new Error(`no data key by name of ${key} found`)
            return null
          }
          return item[key]
        }))])
      .range([height, (margin.top + margin.top)])
  ))
  return scalarObject
}

/**
 * Takes React Chilren and returns true or false if unique axis Id is found
 * @param {Object} Children - React Children through which it maps
 */
export const biaxial = (children) => Children.map(children, child => child.props.hasOwnProperty('axisId')).includes(true)

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
