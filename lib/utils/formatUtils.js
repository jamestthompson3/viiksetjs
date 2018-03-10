'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatXTicks = exports.formatTicks = exports.tooltipTime = exports.formatTime = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _d3TimeFormat = require('d3-time-format');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Takes a data point and formats it to the following time
 * Mon Jan 19 (ddd mmm DD)
 * See D3 documentation here: https://github.com/d3/d3-time-format
 * @param {Date Object}
 */
var formatTime = exports.formatTime = (0, _d3TimeFormat.timeFormat)('%a %b %d');

/**
 * Takes a data point and formats it to the following time
 * Sun Jan 21st 20:29 (ddd mmm DD HH:MM)
 * See D3 documentation here: https://github.com/d3/d3-time-format
 * @param {Date Object}
 */
var tooltipTime = exports.tooltipTime = (0, _d3TimeFormat.timeFormat)('%a %b %d %H:%M');

/**
 * Takes a data point and divides by 1000 and adds 'k' if greater than 1000
 * @param {Integer}
 */
var formatTicks = exports.formatTicks = function formatTicks(d) {
  return typeof d === 'number' ? d >= 1000 ? d / 1000 + 'k' : d : d;
};

/**
 * Takes a data point and determines how it should be formatted
 * @param {Any}
 */
var formatXTicks = exports.formatXTicks = function formatXTicks(d) {
  if ((typeof d === 'undefined' ? 'undefined' : _typeof(d)) === 'object' && (0, _moment2.default)(d).isValid()) {
    return formatTime(d);
  } else {
    return d;
  }
};