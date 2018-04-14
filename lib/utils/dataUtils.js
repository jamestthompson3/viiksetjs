'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createScalarData = exports.extractLabels = exports.extractX = exports.extractY = exports.getY = exports.getX = exports.parseObject = exports.checkMoment = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _d3Scale = require('d3-scale');

var _lodash = require('lodash');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Checks for moment objects
 * @param {Object} data - object to check for moment instances
 * @returns {String} date - date string
 */
var checkMoment = exports.checkMoment = function checkMoment(data) {
  switch (true) {
    case typeof data === 'string' && (0, _moment2.default)(data).isValid():
      return (0, _moment2.default)(data).format();
    case _moment2.default.isMoment(data):
      return data.format();
    case data instanceof Date:
      return data.toString();
    default:
      return data;
  }
};
/**
 * Takes an object and argument and returns the values of the object according to the argument type and optional
 * applicator function
 * @param {Object} object - object which you wish to parse
 * @param {String} arg - one of the javascript types for variables
 * @param {Function} app - applicator function
 * @returns {Any[]} values - values of the object accordingt argument type and result of applicator function
 */
var parseObject = exports.parseObject = function parseObject(object, arg, app) {
  return Object.values(object).map(function (value) {
    return app ? app(value) : value;
  }).filter(function (value) {
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === arg;
  });
};

/**
 * Takes an array of objects and a datakey and returns an array of x-value points
 * @param {Object[]} data - an array of data objects
 * @param {String} xKey - a key for the xvalues, if they cannot be found by looking at the object itself
 * @returns {String[]} xValues - xValue points
 */
var getX = exports.getX = function getX(data, xKey) {
  return xKey ? data.map(function (datum) {
    return datum[xKey];
  }) : (0, _lodash.flatten)(data.map(function (datum) {
    return parseObject(datum, 'string', checkMoment);
  }).map(function (i) {
    return new Date(i);
  }));
};

/**
 * Takes an array of objects and returns an array of y-value points
 * @param {Object[]} data - an array of data objects
 * @param {String} yKey - a key for the yvalue, if not using categorical or timeseries data
 */
var getY = exports.getY = function getY(data, yKey) {
  return yKey ? data.map(function (datum) {
    return datum[yKey];
  }) : (0, _lodash.flatten)(data.map(function (datum) {
    return parseObject(datum, 'number');
  }));
};

/**
 * Takes a data object and extracts all Y values
 * @param {Object} datum - the object which you want to extract the values from
 * @param {String} yKey - a key for the yvalue, if not using categorical or timeseries data
 */
var extractY = exports.extractY = function extractY(datum, yKey) {
  return yKey ? [datum[yKey]] : (0, _lodash.flatten)(parseObject(datum, 'number'));
};

/**
 * Takes a data object and extracts all X values and parse them to date time objects if applicable
 * @param {Object} datum - the object which you want to extract the values from
 * @param {String} xKey - a key for the xvalue, if not using categorical or timeseries data
 */
var extractX = exports.extractX = function extractX(datum, xKey) {
  return xKey ? [datum[xKey]] : (0, _lodash.flatten)(parseObject(datum, 'string')).map(function (i) {
    return checkMoment(i);
  });
};

/**
 * Takes a data object and extracts all Y labels
 * @param {Object} datum - the object which you want to extract the labels from
 */
var extractLabels = exports.extractLabels = function extractLabels(datum) {
  return (0, _lodash.flatten)(Object.entries(datum).filter(function (value) {
    if (typeof value[1] === 'number') {
      return value[0];
    }
  }));
};

/**
 * Takes four parameters and produces and object with a scale for each column
 * in the dataset
 * @param {Object[]} data - an array of data objects
 * @param {Object[]} dataKeys - the keys or column names of the data objects
 * @param {Number} height - the height of the svg container
 * @param {Object} margin - the margin object used in the chartArea
 */
var createScalarData = exports.createScalarData = function createScalarData(data, dataKeys, height, margin) {
  var scalarObject = {};
  dataKeys.map(function (key) {
    return scalarObject[key] = (0, _d3Scale.scaleLinear)().domain([0, Math.max.apply(Math, _toConsumableArray(data.map(function (item) {
      if (!item[key]) {
        new Error('no data key by name of ' + key + ' found');
        return 0;
      }
      return item[key];
    })))]).range([height, margin.top + margin.top]);
  });
  return scalarObject;
};