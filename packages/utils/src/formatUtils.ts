import { timeFormat } from 'd3-time-format';
import isValid from 'date-fns/is_valid';

import { parseIfDate } from './dataUtils';

/**
 * Takes a data point and formats it to the following time
 * Mon Jan 19 (ddd mmm DD)
 */
export const formatTime = timeFormat('%a %b %d');

/**
 * Takes a data point and formats it to the following time
 * Sun Jan 21st 20:29 (ddd mmm DD HH:MM)
 */
export const tooltipTime = timeFormat('%a %b %d %H:%M');

/**
 * Default tick formatter, takes a data point and divides by 1000 and adds 'k' if greater than 1000
 */
export const formatTicks = (d: string | number) =>
  typeof d === 'number' ? (d >= 1000 ? `${d / 1000}k` : d) : d;

/**
 * Default formatter function. Parses dates if passed a data, if not, just returns what it was given
 */
export const formatXTicks = (d: string | Date | number) => {
  const parsed = parseIfDate(d);

  if (parsed && isValid(parsed)) {
    return formatTime(parsed);
  } else {
    return d;
  }
};
