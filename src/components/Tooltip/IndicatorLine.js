import React from 'react'
import moment from 'moment'
import { Observable } from 'rxjs'
import { uniq, flow, head, sortedIndex } from 'lodash'
import { scaleLinear, scaleTime, scaleBand } from 'd3-scale'

import { getX, getY, extractLabels, extractX, extractY, createScalarData, biaxial, localPoint } from 'common/vx/utils/dataUtils'

const IndicatorLine = ({ props }) => {
  const { data, type, parentWidth, parentHeight, xKey, children, yKey, margin, target, determineScale } = props
  console.log(target)
    if(target) {
      const width = parentWidth - margin.left - margin.right
    const height = parentHeight - margin.top - margin.bottom
    const yPoints = getY(data, yKey)
    const xPoints = uniq(getX(data, xKey)).map(datum => moment(datum).isValid() ? moment(datum).toDate() : datum)
    const xScale = biaxial(children)
      ? scaleTime()
        .domain([xPoints[0], xPoints[xPoints.length - 1]])
        .range([margin.left, width - margin.right])
      : determineScale({ type, width, xPoints })
    const yScale = scaleLinear()
      .domain([0, Math.max(...yPoints)])
      .range([height, margin.top])
    const dataKeys = extractLabels(data[0])
    const yScales = biaxial(children) ? createScalarData(data, dataKeys, height, margin) : null
    const mouseMove$ = Observable.fromEvent(target, 'mousemove')
      .map((event) => {
        event.stopPropagation()
        const xValue = xScale.invert(localPoint(target, event).x)
        flow(
          xValue => sortedIndex(xPoints, xValue),
          index => ({ dLeft: data[index - 1], dRight: data[index] }),
          bounds => {
            return xValue - moment(head(extractX(bounds.dLeft))) > moment(head(extractX(bounds.dRight))) - xValue
              ? bounds.dRight
              : bounds.dLeft
          },
          calculatedData => {
            const x = xScale(moment(head(extractX(calculatedData))))
            const yCoords = yScales
              ? dataKeys.map(key => yScales[key](calculatedData[key]))
              : extractY(calculatedData).map(item => yScale(item))
            console.log('event detcted') //{ calculatedData, x, yCoords }
          }
        )(xValue)
      })
    const mouseLeave$ = Observable.fromEvent(target, 'mouseleave')
      .map(() => console.log('mouse left')) //{ calculatedData: null, x: null, yCoords: null }
    Observable.merge(mouseMove$, mouseLeave$).subscribe()}
  return null
}

export default IndicatorLine
