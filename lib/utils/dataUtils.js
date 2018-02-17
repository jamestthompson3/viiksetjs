var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import { scaleLinear } from 'd3-scale';
import { flatten } from 'lodash';

/**
 * Takes an object and arguement and returns the values of the object according to the argument type
 * @param {Object} object - object which you wish to parse
 * @param {String} arg - one of the javascript types for variables
 */
export var parseObject = function parseObject(object, arg) {
  return object != null && Object.values(object).map(function (value) {
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === arg ? value : null;
  }).filter(function (s) {
    return s != null;
  });
};

/**
 * Takes an array of objects and a datakey and returns an array of x-value points
 * @param {Object[]} data - an array of data objects
 * @param {String} xKey - a key for the xvalues, if they cannot be found by looking at the object itself
 */
export var getX = function getX(data, xKey) {
  return xKey ? data.map(function (datum) {
    return datum[xKey];
  }) : flatten(data.map(function (datum) {
    return parseObject(datum, 'string');
  })).filter(function (i) {
    return i != null;
  });
};

/**
 * Takes an array of objects and returns an array of y-value points
 * @param {Object[]} data - an array of data objects
 * @param {String} yKey - a key for the yvalue, if not using categorical or timeseries data
 */
export var getY = function getY(data, yKey) {
  return yKey ? data.map(function (datum) {
    return datum[yKey];
  }) : flatten(data.map(function (datum) {
    return parseObject(datum, 'number');
  })).filter(function (i) {
    return i != null;
  });
};

/**
 * Takes a data object and extracts all Y values
 * @param {Object} datum - the object which you want to extract the values from
 * @param {String} yKey - a key for the yvalue, if not using categorical or timeseries data
 */
export var extractY = function extractY(datum, yKey) {
  return yKey ? [datum[yKey]] : flatten(parseObject(datum, 'number')).filter(function (i) {
    return i != null;
  });
};

/**
 * Takes a data object and extracts all X values
 * @param {Object} datum - the object which you want to extract the values from
 * @param {String} xKey - a key for the xvalue, if not using categorical or timeseries data
 */
export var extractX = function extractX(datum, xKey) {
  return xKey ? [datum[xKey]] : flatten(parseObject(datum, 'string')).filter(function (i) {
    return i != null;
  });
};

/**
 * Takes a data object and extracts all Y labels
 * @param {Object} datum - the object which you want to extract the labels from
 */
export var extractLabels = function extractLabels(datum) {
  return flatten(Object.entries(datum).map(function (value) {
    if (typeof value[1] === 'number') {
      return value[0];
    }
  })).filter(function (i) {
    return i != null;
  });
};

/**
 * Takes four parameters and produces and object with a scale for each column
 * in the dataset
 * @param {Object[]} data - an array of data objects
 * @param {Object[]} dataKeys - the keys or column names of the data objects
 * @param {Number} height - the height of the svg container
 * @param {Object} margin - the margin object used in the chartArea
 */
export var createScalarData = function createScalarData(data, dataKeys, height, margin) {
  var scalarObject = {};
  dataKeys.map(function (key) {
    return scalarObject[key] = scaleLinear().domain([0, Math.max.apply(Math, _toConsumableArray(data.map(function (item) {
      if (!item[key]) {
        new Error('no data key by name of ' + key + ' found');
        return null;
      }
      return item[key];
    })))]).range([height, margin.top + margin.top]);
  });
  return scalarObject;
};