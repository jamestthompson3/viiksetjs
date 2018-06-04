import { scaleLinear } from 'd3-scale'
import { flatten, head, last, get } from 'lodash'
import moment from 'moment'

/**
 * Checks for moment objects
 * @param {Object} data - object to check for moment instances
 * @returns {String} date - date string
 */
export const checkMoment = data => {
  switch (true) {
    case typeof data === 'string' && moment(data).isValid():
      return moment(data).format()
    case moment.isMoment(data):
      return data.toISOString()
    case data instanceof Date:
      return data.toISOString()
    default:
      return data
  }
}
/**
 * Takes an object and argument and returns the values of the object according to the argument type and optional
 * applicator function
 * @param {Object} object - object which you wish to parse
 * @param {String} arg - one of the javascript types for variables
 * @param {Function} app - applicator function
 * @returns {Any[]} values - values of the object accordingt argument type and result of applicator function
 */
export const parseObject = (object, arg, app) =>
  Object.values(object)
    .map(value => (app ? app(value) : value))
    .filter(value => typeof value === arg)

/**
 * Takes an array of objects and a datakey and returns an array of x-value points
 * @param {Object[]} data - an array of data objects
 * @param {String} xKey - a key for the xvalues, if they cannot be found by looking at the object itself
 * @returns {String[]} xValues - xValue points
 */
export const getX = (data, xKey) =>
  xKey
    ? data.map(datum => get(datum, xKey))
    : flatten(data.map(datum => parseObject(datum, 'string', checkMoment)).map(i => new Date(i)))

/**
 * Takes an array of objects and returns an array of y-value points
 * @param {Object[]} data - an array of data objects
 * @param {String} yKey - a key for the yvalue, if not using categorical or timeseries data
 */
export const getY = (data, yKey) =>
  yKey
    ? data.map(datum => get(datum, yKey))
    : flatten(data.map(datum => parseObject(datum, 'number')))

/**
 * Takes a data object and extracts all Y values
 * @param {Object} datum - the object which you want to extract the values from
 * @param {String} yKey - a key for the yvalue, if not using categorical or timeseries data
 */
export const extractY = (datum, yKey) =>
  yKey ? [get(datum, yKey)] : flatten(parseObject(datum, 'number'))

/**
 * Takes a data object and extracts all X values and parse them to date time objects if applicable
 * @param {Object} datum - the object which you want to extract the values from
 * @param {String} xKey - a key for the xvalue, if not using categorical or timeseries data
 */
export const extractX = (datum, xKey) =>
  xKey
    ? [get(datum, xKey)]
    : flatten(parseObject(datum, 'string')).map(i => new Date(checkMoment(i)))

/**
 * Takes a data object and extracts all Y labels by parsing which values contain numbers
 * @param {Object} datum - the object which you want to extract the labels from
 * @returns {String[]} labels - an array of the labels
 */
export const extractLabels = datum =>
  flatten(
    Object.entries(datum).map(value => {
      if (typeof last(value) === 'number') {
        return head(value)
      }
    })
  ).filter(i => i != null)

/**
 * Takes four parameters and produces and object with a scale for each column
 * in the dataset
 * @param {Object[]} data - an array of data objects
 * @param {Object[]} dataKeys - the keys or column names of the data objects
 * @param {Number} height - the height of the svg container
 * @param {Object} margin - the margin object used in the chartArea
 */
export const createScalarData = (data, dataKeys, height, margin) => {
  const scalarObject = {}
  dataKeys.map(
    key =>
      (scalarObject[key] = scaleLinear()
        .domain([
          0,
          Math.max(
            ...data.map(item => {
              if (!item[key]) {
                new Error(`no data key by name of ${key} found`)
                return 0
              }
              return item[key]
            })
          )
        ])
        .range([height, margin.top + margin.top]))
  )
  return scalarObject
}
