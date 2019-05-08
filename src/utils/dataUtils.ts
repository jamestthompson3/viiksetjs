import { scaleLinear } from 'd3-scale'
import flatten from 'lodash/flatten'
import head from 'lodash/head'
import last from 'lodash/last'
import get from 'lodash/get'
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import { Margin } from '../types/index'

/**
 * Checks for dates
 */
export const checkDate = (data: Object): string => {
  if (typeof data === 'string' || data instanceof Date) {
    return format(parse(data))
  }
}

type Applicator<T> = (arg: Object) => T
/**
 * Takes an object and argument and returns the values of the object according to the argument type and optional
 * applicator function
 */
export function parseObject<T>(
  obj: Object,
  arg: string,
  applicator: Applicator<T> = value => value['value']
): T[] {
  return Object.values(obj)
    .map(applicator)
    .filter(value => typeof value === arg)
}

/**
 * Takes an array of objects and a datakey and returns an array of x-value points
 */
export const getX = (data: Object[], xKey: string): any[] =>
  xKey
    ? data.map(datum => get(datum, xKey))
    : flatten(
        data
          .map(datum => parseObject(datum, 'string', checkDate))
          /* eslint-disable-next-line */
          .map(i => new Date(i[0]))
      )

/**
 * Takes an array of objects and returns an array of y-value points
 */
export const getY = (data: Object[], yKey: string): any =>
  yKey
    ? data.map(datum => get(datum, yKey))
    : flatten(data.map(datum => parseObject(datum, 'number')))

/**
 * Takes a data object and extracts all Y values
 */
export const extractY = (datum: Object, yKey: string | null = null): any[] =>
  yKey ? [get(datum, yKey)] : flatten(parseObject(datum, 'number'))

/**
 * Takes a data object and extracts all X values and parse them to date time objects if applicable
 */
export const extractX = (datum: Object, xKey: string | null = null): any[] =>
  xKey
    ? [get(datum, xKey)]
    : flatten(parseObject(datum, 'string', checkDate)).map((i: string) => new Date(i))

/**
 * Takes a data object and extracts all Y labels by parsing which values contain numbers
 */
export const extractLabels = (datum: Object): string[] =>
  flatten(
    Object.entries(datum).map(value => {
      if (typeof last(value) === 'number') {
        return head(value)
      }
    })
    // eslint-disable-next-line
  ).filter((i: string) => i != null)

/**
 * Takes four parameters and produces and object with a scale for each column
 * in the dataset
 */
export const createScalarData = (
  data: Object[],
  dataKeys: string[],
  height: number,
  margin: Margin
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
        .range([height, margin.top]))
  )
  return scalarObject
}
