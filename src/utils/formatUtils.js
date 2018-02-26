import { timeFormat } from 'd3-time-format'
import moment from 'moment'
/**
 * Takes a data point and formats it to the following time
 * Mon Jan 19 (ddd mmm DD)
 * See D3 documentation here: https://github.com/d3/d3-time-format
 * @param {Date Object}
 */
export const formatTime = timeFormat('%a %b %d')

/**
 * Takes a data point and formats it to the following time
 * Sun Jan 21st 20:29 (ddd mmm DD HH:MM)
 * See D3 documentation here: https://github.com/d3/d3-time-format
 * @param {Date Object}
 */
export const tooltipTime = timeFormat('%a %b %d %H:%M')

/**
 * Takes a data point and divides by 1000 and adds 'k' if greater than 1000
 * @param {Integer}
 */
export const formatTicks = d => (d >= 1000 ? `${d / 1000}k` : d)

/**
 * Takes a data point and determines how it should be formatted
 * @param {Any}
 */
export const formatXTicks = d => {
  if (typeof d === 'object' && moment(d).isValid()) {
    return formatTime(d)
  } else {
    return d
  }
}
