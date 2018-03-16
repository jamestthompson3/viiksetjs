// @flow
import { scaleLinear } from 'd3-scale'
import { flatten } from 'lodash'
import moment from 'moment'

/**
 * Takes an object and arguement and returns the values of the object according to the argument type
 * @param {Object} object - object which you wish to parse
 * @param {String} arg - one of the javascript types for variables
 */
export const parseObject = (object: any, arg: string) =>
  Object.values(object)
    .map(value => (typeof value === arg ? value : null))
    .filter(s => s != null)

/**
 * Takes an array of objects and a datakey and returns an array of x-value points
 * @param {Object[]} data - an array of data objects
 * @param {String} xKey - a key for the xvalues, if they cannot be found by looking at the object itself
 */
export const getX = (data: Array<any>, xKey: string) =>
  xKey
    ? data.map(datum => datum[xKey])
    : flatten(data.map(datum => parseObject(datum, 'string'))).filter(i => i != null)

/**
 * Takes an array of objects and returns an array of y-value points
 * @param {Object[]} data - an array of data objects
 * @param {String} yKey - a key for the yvalue, if not using categorical or timeseries data
 */
export const getY = (data: Array<any>, yKey: string) =>
  yKey
    ? data.map(datum => datum[yKey])
    : flatten(data.map(datum => parseObject(datum, 'number'))).filter(i => i != null)

/**
 * Takes a data object and extracts all Y values
 * @param {Object} datum - the object which you want to extract the values from
 * @param {String} yKey - a key for the yvalue, if not using categorical or timeseries data
 */
export const extractY = (datum: any, yKey: string) =>
  yKey ? [datum[yKey]] : flatten(parseObject(datum, 'number'))

/**
 * Takes a data object and extracts all X values and parse them to date time objects if applicable
 * @param {Object} datum - the object which you want to extract the values from
 * @param {String} xKey - a key for the xvalue, if not using categorical or timeseries data
 */
export const extractX = (datum: any, xKey: string) =>
  xKey
    ? [datum[xKey]]
    : flatten(parseObject(datum, 'string')).map(i => (moment(i).isValid() ? moment(i) : i))

/**
 * Takes a data object and extracts all Y labels
 * @param {Object} datum - the object which you want to extract the labels from
 */
export const extractLabels = (datum: any) =>
  flatten(
    Object.entries(datum).map(value => {
      if (typeof value[1] === 'number') {
        return value[0]
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
export const createScalarData = (
  data: Array<any>,
  dataKeys: string[],
  height: number,
  margin: { top: number, bottom: number, right: number, left: number }
) => {
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
