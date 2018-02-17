import { timeFormat } from 'd3-time-format';

/**
 * Takes a data point and formats it to the following time
 * Mon Jan 19 (ddd mmm DD)
 * See D3 documentation here: https://github.com/d3/d3-time-format
 * @param {Date Object}
 */
export var formatTime = timeFormat('%a %b %d');

/**
 * Takes a data point and formats it to the following time
 * Sun Jan 21st 20:29 (ddd mmm DD HH:MM)
 * See D3 documentation here: https://github.com/d3/d3-time-format
 * @param {Date Object}
 */
export var tooltipTime = timeFormat('%a %b %d %H:%M');

/**
 * Takes a data point and divides by 1000 and adds 'k' if greater than 1000
 * @param {Integer}
 */
export var formatTicks = function formatTicks(d) {
  return d >= 1000 ? d / 1000 + 'k' : d;
};

/**
 * Takes a data point and determines how it should be formatted
 * @param {Any}
 */
export var formatXTicks = function formatXTicks(d) {
  if (d.getTime() != null) {
    return formatTime(d);
  } else {
    return d;
  }
};