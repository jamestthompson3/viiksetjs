import * as React from 'react'
import PropTypes from 'prop-types'
import { Group } from '@vx/group'
import { stack } from 'd3-shape'
import { scaleOrdinal, scaleBand, scaleLinear, scaleTime } from 'd3-scale'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import head from 'lodash/head'
import sum from 'lodash/sum'
import set from 'lodash/set'

import { extractLabels, extractX } from '../../utils/dataUtils'
import { StyledBar } from '../styledComponents'
import { BarChartProps } from '../../types'

function calcData({ data, keys, type, xPoints, yPoints, margin, height, width }) {
  const dataDomain = Math.max(
    ...flatten(
      data.map((d: T) => keys.map((key: string) => get(d, key))).map((arr: number[]) => sum(arr))
    )
  )

  const scalar = type === 'linear' ? scaleLinear : scaleTime

  console.log('CALLING INSIDE OF SCALAR FUNCTION')
  if (orientation === 'horizontal') {
    const xScale = scalar()
      .domain([0, dataDomain])
      .range([margin.left, width])
    const yScale = scaleBand()
      .domain(yPoints)
      .range([height, margin.top])
      .padding(0.1)
    return { xScale, yScale }
  } else {
    const xScale = scaleBand()
      .domain(xPoints)
      .range([margin.left, width])
      .padding(0.1)
    const yScale = scalar()
      .domain([dataDomain, 0])
      .range([height, margin.top])
    return { xScale, yScale }
  }
}

function StackedBar<T>({
  data,
  type,
  orientation,
  colors,
  keys,
  yKey,
  xKey,
  height,
  margin,
  noTool,
  mouseMove,
  declareBar,
  yPoints,
  xPoints,
  width,
  mouseLeave,
  barProps
}: Props<T>) {
  React.useEffect(() => {
    declareBar()
  }, [])
  console.log('ORIENTATION: ', orientation)
  // const [scales, setScales] = React.useState({ xScale: null, yScale: null })
  const scales = calcData({ data, keys, type, xPoints, yPoints, margin, height, width })

  const determineBarWidth = ({ d, isHorizontal, xScale, yScale }) => {
    if (isHorizontal) {
      return xScale(d[1]) - xScale(d[0])
    } else {
      return yScale(d[1]) - yScale(d[0])
    }
  }

  if (!keys) {
    // eslint-disable-next-line
    console.warn(
      'StackedBar: You have not provided the keys prop, this could explain unexpected render output'
    )
  }

  const zScale = scaleOrdinal()
    .domain(keys || extractLabels(data[0]))
    .range(colors)
  const { xScale, yScale } = scales
  console.log('xScale: ', xScale, 'yScale: ', yScale)
  const isHorizontal = orientation === 'horizontal'
  const series = stack().keys(keys || extractLabels(data[0]))(data)
  const bandwidth = isHorizontal ? yScale.bandwidth() : xScale.bandwidth()
  const yPoint = (d: T) => yScale(get(d, yKey))
  const xPoint = (d: T) => xScale(extractX(d, xKey))
  return (
    <Group>
      {series &&
        series.map((s: SeriesObj[], i: number) => (
          <Group key={`BarGroup-Outer-${i}`}>
            {s.map((d: T, ii: number) => {
              const barWidth = determineBarWidth({ d, isHorizontal, xScale, yScale })
              return (
                <StyledBar
                  key={`bar-group-bar-${i}-${ii}-${s.key}`}
                  x={isHorizontal ? xScale(d[0]) : xPoint(get(d, 'data'))}
                  y={isHorizontal ? yPoint(get(d, 'data')) : height + margin.top - yScale(d[1])}
                  width={isHorizontal ? barWidth : bandwidth}
                  height={isHorizontal ? bandwidth : barWidth}
                  fill={zScale(s.key)}
                  onMouseMove={(event: React.SyntheticEvent) => {
                    const key = s.key
                    const datum = set({}, xKey || 'xValue', head(extractX(get(d, 'data'), xKey)))
                    set(datum, key, get(d, `data.${key}`))
                    return noTool || mouseMove({ event, datum })
                  }}
                  onMouseLeave={() => mouseLeave()}
                  {...barProps}
                />
              )
            })}
          </Group>
        ))}
    </Group>
  )
}

interface SeriesObj<T> {
  key: string
  data: T[]
}

interface Props<T> extends BarChartProps {
  data: T[]
  colors: string[]
  keys: string[]
}

export default React.memo(StackedBar)
