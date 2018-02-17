function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import React from 'react';
import moment from 'moment';
import { Observable } from 'rxjs';
import { uniq, flow, head, sortedIndex } from 'lodash';
import { scaleLinear, scaleTime, scaleBand } from 'd3-scale';

import { getX, getY, extractLabels, extractX, extractY, createScalarData, biaxial, localPoint } from 'common/vx/utils/dataUtils';

var IndicatorLine = function IndicatorLine(_ref) {
  var props = _ref.props;
  var data = props.data,
      type = props.type,
      parentWidth = props.parentWidth,
      parentHeight = props.parentHeight,
      xKey = props.xKey,
      children = props.children,
      yKey = props.yKey,
      margin = props.margin,
      target = props.target,
      determineScale = props.determineScale;

  console.log(target);
  if (target) {
    var width = parentWidth - margin.left - margin.right;
    var height = parentHeight - margin.top - margin.bottom;
    var yPoints = getY(data, yKey);
    var xPoints = uniq(getX(data, xKey)).map(function (datum) {
      return moment(datum).isValid() ? moment(datum).toDate() : datum;
    });
    var xScale = biaxial(children) ? scaleTime().domain([xPoints[0], xPoints[xPoints.length - 1]]).range([margin.left, width - margin.right]) : determineScale({ type: type, width: width, xPoints: xPoints });
    var yScale = scaleLinear().domain([0, Math.max.apply(Math, _toConsumableArray(yPoints))]).range([height, margin.top]);
    var dataKeys = extractLabels(data[0]);
    var yScales = biaxial(children) ? createScalarData(data, dataKeys, height, margin) : null;
    var mouseMove$ = Observable.fromEvent(target, 'mousemove').map(function (event) {
      event.stopPropagation();
      var xValue = xScale.invert(localPoint(target, event).x);
      flow(function (xValue) {
        return sortedIndex(xPoints, xValue);
      }, function (index) {
        return { dLeft: data[index - 1], dRight: data[index] };
      }, function (bounds) {
        return xValue - moment(head(extractX(bounds.dLeft))) > moment(head(extractX(bounds.dRight))) - xValue ? bounds.dRight : bounds.dLeft;
      }, function (calculatedData) {
        var x = xScale(moment(head(extractX(calculatedData))));
        var yCoords = yScales ? dataKeys.map(function (key) {
          return yScales[key](calculatedData[key]);
        }) : extractY(calculatedData).map(function (item) {
          return yScale(item);
        });
        console.log('event detcted'); //{ calculatedData, x, yCoords }
      })(xValue);
    });
    var mouseLeave$ = Observable.fromEvent(target, 'mouseleave').map(function () {
      return console.log('mouse left');
    }); //{ calculatedData: null, x: null, yCoords: null }
    Observable.merge(mouseMove$, mouseLeave$).subscribe();
  }
  return null;
};

export default IndicatorLine;