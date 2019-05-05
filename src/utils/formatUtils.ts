import { timeFormat } from 'd3-time-format'
import isValid from 'date-fns/is_valid'

import { checkDate } from './dataUtils'

/**
 * Takes a data point and formats it to the following time
 * Mon Jan 19 (ddd mmm DD)
 */
export const formatTime = timeFormat('%a %b %d')

/**
 * Takes a data point and formats it to the following time
 * Sun Jan 21st 20:29 (ddd mmm DD HH:MM)
 */
export const tooltipTime = timeFormat('%a %b %d %H:%M')

/**
 * Takes a data point and divides by 1000 and adds 'k' if greater than 1000
 */
export const formatTicks = (d: string | number) =>
  typeof d === 'number' ? (d >= 1000 ? `${d / 1000}k` : d) : d

/**
 * Takes a data point and determines how it should be formatted
 */
export const formatXTicks = (d: string | Date | number) => {
  const checked = new Date(checkDate(d))

  if (isValid(checked)) {
    return formatTime(checked)
  } else {
    return d
  }
}
