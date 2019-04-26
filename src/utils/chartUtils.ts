import * as React from 'react'
import { Point } from '@vx/point'
import { scaleLinear, scaleTime, scaleBand } from 'd3-scale'
import { Margin, ScaleFunction } from '../types/index'
import head from 'lodash/head'
import last from 'lodash/last'
import sortedUniq from 'lodash/sortedUniq'

/**
 * Recursively clones children, passing props down nested DOM structures
 */
export const recursiveCloneChildren = (children: React.ReactNode, props: Object): React.ReactNode =>
  React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child

    if (child.props) {
      props.children = recursiveCloneChildren(child.props.children, props)

      return React.cloneElement(child, props)
    }

    return child
  })

type ScaleProps = {
  type: string,
  xPoints: number[] | string[],
  yPoints: number[] | string[],
  width: number,
  invertedRange: boolean,
  height: number,
  orientation: string,
  margin: Margin
}

/**
 * Determines the xScale of the chart based on chart type
 */
export const determineXScale = ({
  type,
  xPoints,
  width,
  margin
}: Partial<ScaleProps>): ScaleFunction => {
  const range = [margin.left, width]
  const sortedX = sortedUniq(xPoints)

  switch (type) {
    case 'ordinal':
      return scaleBand()
        .domain(xPoints)
        .range(range)
        .padding(0.1)
    case 'linear':
      return scaleLinear()
        .domain([head(sortedX), last(sortedX)])
        .range(range)
    default:
      return scaleTime()
        .domain([head(sortedX), last(sortedX)])
        .range(range)
  }
}

/**
 * Determines the yScale of the chart based on chart type
 */
export const determineYScale = ({
  type,
  orientation,
  yPoints,
  height,
  invertedRange,
  margin
}: Partial<ScaleProps>): ScaleFunction => {
  const range = [height, margin.top]
  const reverseRange = [margin.top, height]

  switch (type) {
    case 'ordinal':
      return scaleLinear()
        .domain([0, Math.max(...yPoints)])
        .range(range)
    case 'linear':
      return orientation === 'horizontal'
        ? scaleBand()
            .domain(yPoints)
            .range([height, margin.top])
            .padding(0.1)
        : scaleLinear()
            .domain([0, Math.max(...yPoints)])
            .range(invertedRange ? reverseRange : range)
    default:
      return scaleLinear()
        .domain([0, Math.max(...yPoints)])
        .range(range)
  }
}

/**
 * Finds the xCoordinates within the tooltipCalcuation
 * TODO Support more chart types
 */
export const findTooltipX = ({
  type,
  calculatedX,
  xScale
}: {
  type: string,
  calculatedX: number,
  xScale(num: number): number
}): number => {
  switch (type) {
    case 'ordinal':
    case 'linear':
      return xScale(calculatedX)
    default:
      return xScale(calculatedX)
  }
}

/**
 * Takes React Chilren and returns true or false if unique axis Id is found
 */
export const biaxial = (children: React.ReactNode): boolean =>
  React.Children.map(
    children,
    child => React.isValidElement(child) && child.props.hasOwnProperty('axisId')
  ).includes(true)

/**
 * Own implementation of localPoint from VX. Makes it work on Firefox
 */
export function localPoint(node: any, event: any): Point {
  // called with no args
  if (!node) return

  // called with localPoint(event)
  if (node.target) {
    event = node

    // set node to targets owner svg
    node = event.target.ownerSVGElement

    // find the outermost svg
    while (node.ownerSVGElement) {
      node = node.ownerSVGElement
    }
  }

  // default to mouse event
  let { clientX, clientY } = event

  // support touch event
  if (event.changedTouches) {
    clientX = event.changedTouches[0].clientX
    clientY = event.changedTouches[0].clientY
  }

  // FF workaround
  if (navigator.userAgent.includes('Firefox')) {
    const rect = node.getBoundingClientRect()
    return new Point({
      x: clientX - rect.left - node.clientLeft,
      y: clientY - rect.top - node.clientTop
    })
  }

  // calculate coordinates from svg
  let point = node.createSVGPoint()
  point.x = clientX
  point.y = clientY
  point = point.matrixTransform(node.getScreenCTM().inverse())

  return new Point({
    x: point.x,
    y: point.y
  })
}
