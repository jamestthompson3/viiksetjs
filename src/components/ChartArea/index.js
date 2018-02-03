import React, { Children, cloneElement, Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import { withParentSize } from '@vx/responsive'
import { Group } from '@vx/group'
import { AxisBottom, AxisLeft } from '@vx/axis'
import { Bar, Line } from '@vx/shape'
import { GridRows } from '@vx/grid'
import { scaleLinear, scaleTime, scaleBand } from 'd3-scale'
import moment from 'moment'
import styled from 'styled-components'
import { flow, zip, uniq, sortedIndex, head, throttle } from 'lodash'

import { getX, getY, extractLabels, extractX, extractY, parseObject, createScalarData, biaxial, localPoint } from 'common/vx/utils/dataUtils'
import { formatTime, tooltipTime, formatTicks, formatXTicks } from 'common/vx/utils/formatUtils'
import withTooltip from '../Tooltip/withTooltip'

const TooltipWrapper = styled.div`
  display: block;
  border: 2px solid ${p => p.theme[p.color] || p.color || p.theme.primaryColor};
  border-radius: 5px;
  background: #1a2e3c;
  padding: 8px;
  > * {
    margin: 0;
  }
`

const Corner = styled.div`
  height: 16px;
  width: 16px;
  margin-top: -0.625rem;
  z-index: 110;
  border-right: 2px solid ${p => p.theme[p.color] || p.color || p.theme.primaryColor};
  border-bottom: 2px solid ${p => p.theme[p.color] || p.color || p.theme.primaryColor};
  border-right-bottom-radius: 5px;
  background: #1a2e3c;
  transform: rotate(45deg);
`

const TooltipContainer = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: ${p => `${p.left - 8.25}px`};
  pointer-events: none;
  z-index: 1000;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`

const TooltipComponent = ({ tooltipData, color, left }) => {
  const time = moment(extractX(tooltipData)[0])
  const values = extractY(tooltipData)
  const labels = parseObject(tooltipData, 'string')
  const displayValues = zip([values, labels])
  return (
    <TooltipContainer left={left}>
      <TooltipWrapper color={color}>
        <p>{tooltipTime(time)}</p>
        {displayValues.map(([value, label]) => <p key={value}>{`${label}: ${value}`}</p>)}
      </TooltipWrapper>
      <Corner color={color} left={left} />
    </TooltipContainer>
  )
}

const determineScale = ({ type, xPoints, width }) => {
  switch (type) {
    case 'ordinal':
      return scaleBand()
        .domain(xPoints)
        .range([margin.left, width])
        .padding(0.1)
    case 'linear':
      return scaleLinear()
        .domain([xPoints[0], xPoints[xPoints.length - 1]])
        .range([margin.left, width])
    default:
      return scaleTime()
        .domain([xPoints[0], xPoints[xPoints.length - 1]])
        .range([margin.left, width])
  }
}

const margin = { top: 18, right: 15, bottom: 0, left: 30 }

const ChartArea = ({ data, color, children, parentHeight, parentWidth, tooltip: Tooltip, xKey, yKey, type, formatter, stroke, calculatedData, x, yCoords, updateTooltip }) => {
  const mouseMove = throttle(({ event, data, xPoints, height, children, xScale, yScale, margin }) => {
    const dataKeys = extractLabels(data[0])
    const yScales = biaxial(children) ? createScalarData(data, dataKeys, height, margin) : null
    const xValue = xScale.invert(localPoint(this.chart, event).x)
    flow(
      xValue => sortedIndex(xPoints, xValue),
      index => ({ dLeft: data[index - 1], dRight: data[index] }),
      bounds => {
        return xValue - moment(head(extractX(bounds.dLeft))) > moment(head(extractX(bounds.dRight))) - xValue
          ? bounds.dRight || bounds.dLeft
          : bounds.dLeft || bounds.dRight
      },
      calculatedData => {
        const x = xScale(moment(head(extractX(calculatedData))))
        const yCoords = yScales
          ? dataKeys.map(key => yScales[key](calculatedData[key]))
          : extractY(calculatedData).map(item => yScale(item))
        return updateTooltip({ calculatedData, x, yCoords })

      }
    )(xValue)
  },20)

  const mouseLeave = () => updateTooltip({ calculatedData: null, x: null, yCoords: null })

  const width = parentWidth - margin.left - margin.right
  const height = parentHeight - margin.top - margin.bottom
  const xPoints = uniq(getX(data, xKey)).map(datum => moment(datum).isValid() ? moment(datum).toDate() : datum)
  const yPoints = getY(data, yKey)
  const yScale = scaleLinear()
    .domain([0, Math.max(...yPoints)])
    .range([height, margin.top])
  const xScale = determineScale({ type, width, xPoints })
  if (biaxial(children)) {
    const xScale = scaleTime()
      .domain([xPoints[0], xPoints[xPoints.length - 1]])
      .range([margin.left, width - margin.right])
    const chartChildren = Children.map(children, child => cloneElement(child, ({ data, height, width, margin, xScale, formatter })))
    return (
      <Fragment>
        <svg
          width={parentWidth}
          height={parentHeight}
          preserveAspectRatio='none'
          viewBox={`15 0 ${parentWidth} ${parentHeight}`}
          ref={svg => { this.chart = svg }}
        >
          <Group left={margin.left}>
            <GridRows
              lineStyle={{ pointerEvents: 'none' }}
              scale={yScale}
              left={margin.left}
              width={width - margin.right - margin.left}
              stroke={stroke}
            />
            {chartChildren}
            <AxisBottom
              scale={xScale}
              stroke={color}
              top={height}
              numTicks={6}
              tickLabelProps={() => ({ fill: color, dy: '-0.25rem', fontWeight: '900', textAnchor: 'left', fontSize: 11 })}
              hideTicks
              tickFormat={formatTime}
            />
            {x && (
              <Fragment>
                <Line
                  from={{ x: x, y: 0 }}
                  to={{ x: x, y: Math.max(...yCoords) + margin.bottom }}
                  stroke='#fff'
                  strokeWidth={1}
                  strokeOpacity={0.5}
                  style={{ pointerEvents: 'none' }}
                />
                {yCoords.map((coord, i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={coord + margin.bottom}
                    fill='rgb(28, 42, 44)'
                    stroke={color}
                    strokeWidth={1}
                    style={{ pointerEvents: 'none' }}
                    fillOpacity={1}
                    r={4}
                  />
                ))}
              </Fragment>
            )}
          </Group>
          <Group left={margin.left + 5}>
            <Bar
              width={width - margin.left - margin.right - 5}
              height={height}
              fill='transparent'
              onMouseMove={() => event => {
                event.persist()
                event.stopPropagation()
                mouseMove({ event, data, yPoints, xPoints, children, xScale, yScale, height, margin })
              }}
              onMouseLeave={() => mouseLeave}
            />
          </Group>
        </svg>
        {x && <Tooltip tooltipData={calculatedData} left={x} color={color} />}
      </Fragment>
    )
  }

  const chartChildren = Children.map(children, child => cloneElement(child, ({ data, xScale, margin, height, xKey, inheritedScale: yScale })))
  return (
    <Fragment>
      <svg
        width={parentWidth}
        height={parentHeight}
        preserveAspectRatio='none'
        viewBox={`${-margin.left} 0 ${parentWidth} ${parentHeight}`}
        ref={svg => { this.chart = svg }}
      >
        {chartChildren}
        <Group left={margin.left}>
          <Bar
            width={width - margin.right - 15}
            height={height}
            fill='transparent'
            onMouseMove={() => event => {
              event.persist()
              event.stopPropagation()
              mouseMove({ event, data, yPoints, xPoints, children, xScale, yScale, height, margin })
            }}
            onMouseLeave={() => mouseLeave}
          />
          <GridRows
            lineStyle={{ pointerEvents: 'none' }}
            scale={yScale}
            width={width - margin.left}
            stroke={stroke}
          />
          <AxisLeft
            scale={yScale}
            numTicks={4}
            stroke={color}
            strokeWidth={2}
            hideTicks
            tickLabelProps={() => ({ fill: color, dx: '-2em' })}
            tickFormat={formatter}
          />
        </Group>
        {x && (
          <Fragment>
            <Line
              from={{ x: x, y: 0 }}
              to={{ x: x, y: Math.max(...yCoords) }}
              stroke='#fff'
              strokeWidth={1}
              strokeOpacity={0.5}
              style={{ pointerEvents: 'none' }}
            />
            {yCoords.map((coord, i) => (
              <circle
                key={i}
                cx={x}
                cy={coord}
                fill='rgb(28, 42, 44)'
                stroke={color}
                strokeWidth={1}
                style={{ pointerEvents: 'none' }}
                fillOpacity={1}
                r={4}
              />
            ))}
          </Fragment>
        )}
        <AxisBottom
          scale={xScale}
          stroke={color}
          top={height}
          numTicks={6}
          tickLabelProps={() => ({ fill: color, dy: '-0.25rem', fontWeight: '900', textAnchor: 'left', fontSize: 11 })}
          hideTicks
          tickFormat={(val) => formatXTicks(val)}
        />
      </svg>
      {x && <Tooltip tooltipData={calculatedData} left={x} color={color} />}
    </Fragment>
  )
}

ChartArea.propTypes = {
  data: PropTypes.array.isRequired,
  /**
   * Optional prop to apply color axes and x-ticks
   */
  color: PropTypes.string,
  /**
   * Optional prop to apply color gridlines
   */
  stroke: PropTypes.string,
  /**
   * A string indicating which data values should be used to create the x-axis
   */
  xKey: PropTypes.string,
  /**
   * A React component to return as a tooltip
   */
  tooltip: PropTypes.func,
  /**
   * A function which formats the axes
   */
  formatter: PropTypes.func
}

ChartArea.defaultProps = {
  data: [],
  color: '#000',
  stroke: '#000',
  tooltip: TooltipComponent,
  formatter: formatTicks
}

export default withTooltip(withParentSize(ChartArea))
