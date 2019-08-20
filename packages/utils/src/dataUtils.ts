import { scaleLinear } from 'd3-scale';
import flatten from 'lodash/flatten';
import head from 'lodash/head';
import last from 'lodash/last';
import get from 'lodash/get';
import parse from 'date-fns/parse';
import { isValid } from 'date-fns';
import { Margin, ScalarObject, GenericNumericData } from './typedef';

export const parseIfDate = (data: any): Date | undefined => {
  if (data instanceof Date) return data;
  if (typeof data === 'string') {
    const date = parse(data);
    if (!isValid(date)) return undefined;
    return date;
  }
  return undefined;
};

type Applicator<T> = (arg: any) => T;
/**
 * Takes an object and argument and returns the values of the object according to the argument type and optional
 * applicator function
 */
export function parseObject<T>(
  obj: Object,
  arg: string,
  applicator: Applicator<T> = value => value
): T[] {
  return Object.values(obj)
    .map(applicator)
    .filter(value => typeof value === arg);
}

/**
 * Takes an array of objects and a datakey and returns an array of x-value points
 */
export const getX = (data: Object[], xKey?: string, type?: string): any[] =>
  xKey
    ? data.map(datum =>
        type === 'time' ? parseIfDate(get(datum, xKey)) : get(datum, xKey)
      )
    : flatten(
        data.map(datum =>
          parseObject<string>(datum, 'string').map((d: string) =>
            parseIfDate(d)
          )
        )
      );
/**
 * Takes an array of objects and returns an array of y-value points
 */
export const getY = (data: Object[], yKey?: string): any =>
  yKey
    ? data.map(datum => get(datum, yKey))
    : flatten(data.map(datum => parseObject(datum, 'number')));

/**
 * Takes a data object and extracts all Y values
 */
export const extractY = (datum: Object, yKey: string | null = null): any[] =>
  yKey ? [get(datum, yKey)] : flatten(parseObject(datum, 'number'));

/**
 * Takes a data object and extracts all X values and parse them to date time objects if applicable
 */
export const extractX = (datum: Object, xKey: string | null = null): any[] =>
  xKey
    ? [get(datum, xKey)]
    : flatten(
        parseObject<string>(datum, 'string').map((d: string) => parseIfDate(d))
      );
/**
 * Takes a data object and extracts all Y labels by parsing which values contain numbers
 */
export const extractLabels = (datum: Object): string[] =>
  flatten(
    Object.entries(datum).map(value => {
      if (typeof last(value) === 'number') {
        return head(value);
      }
    })
  ).filter((i: string) => i != null);

/**
 * Takes four parameters and produces and object with a scale for each column
 * in the dataset
 */
export function createLinearScales(
  data: GenericNumericData[],
  dataKeys: string[],
  height: number,
  margin: Margin
): ScalarObject<number, number> {
  const scalarObject: ScalarObject<number, number> = dataKeys.reduce(
    (accu: ScalarObject<number, number>, curr: string) => {
      accu[curr] = scaleLinear()
        .domain([
          0,
          Math.max(
            ...data.map(item => {
              if (!item[curr]) {
                new Error(`no data key by name of ${curr} found`);
                return 0;
              }

              return item[curr];
            })
          ),
        ])
        .range([height, margin.top]);
      return accu;
    },
    {}
  );
  return scalarObject;
}
