import * as React from 'react'
import get from 'lodash/get'
import { Group } from '@vx/group'
import { scaleBand, scaleLinear, scaleTime } from 'd3-scale'

import { StyledGradient, StyledBar } from '../styledComponents/index'
import { extractX, getY } from '../../utils/dataUtils'
import { determineYScale, determineXScale } from '../../utils/chartUtils'
import { ScaleFunction, Margin } from '../../types/index'

function BarChart<T>({
  declareBar,
  type,
  margin,
  height,
  width,
  data,
  xPoints,
  yPoints: inheritedPoints,
  axisId,
  color,
  dataKey,
  xKey,
  noTool,
  mouseMove,
  mouseLeave,
  nofill,
  orientation,
  inverted,
  barProps
}: Props<T>) {
  const [scales, setScales] = React.useState({ xScale: null, yScale: null })
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (data.map(item => get(item, dataKey)).includes(undefined)) {
        // eslint-disable-next-line
        console.warn(`BarChart: No data found with dataKey ${dataKey}`)
      }
    }
  }, [])
  React.useEffect(() => {
    declareBar()
  }, [])

  React.useEffect(() => {
    const yPoints = getY(data, axisId)
    const scalar = type === 'linear' ? scaleLinear : scaleTime

    if (orientation === 'horizontal') {
      const xScale = scalar()
        .domain([0, Math.max(...yPoints)])
        .range([margin.left, width])
      const yScale = scaleBand()
        .domain(yPoints)
        .range([height, margin.top])
        .padding(0.1)

      return { xScale, yScale }
    } else {
      const xScale = determineXScale({ type: 'ordinal', xPoints, width, margin })
      const yScale = axisId
        ? determineYScale({
            type: 'linear',
            yPoints,
            height,
            invertedRange: true,
            margin
          })
        : scalar()
            .domain([Math.max(...inheritedPoints), 0])
            .range([height, margin.top])

      setScales({ xScale, yScale })
    }
  }, [type, orientation])

  const { xScale, yScale } = scales
  const xPoint = (d: T) => extractX(d, xKey)
  const barHeight = (d: T) => yScale(get(d, dataKey))
  const isHorizontal = orientation === 'horizontal'
  return (
    <>
      <StyledGradient color={color} id={`gradient${xKey}`} />
      {data.map(d => (
        <Group key={`bar${xPoint(d)}`}>
          <StyledBar
            width={xScale.bandwidth()}
            height={barHeight(d)}
            x={xScale(xPoint(d))}
            key="BarChart"
            y={isHorizontal ? barHeight(d) : inverted ? 0 : height - barHeight(d)}
            data={d}
            fill={!nofill && `url(#gradient${xKey})`}
            onMouseMove={(event: React.SyntheticEvent) => noTool || mouseMove({ event, datum: d })}
            onMouseLeave={() => mouseLeave()}
            {...barProps}
          />
        </Group>
      ))}
    </>
  )
}

BarChart.defaultProps = {
  color: 'rgb(0, 157, 253)',
  nofill: false,
  inverted: false
}

interface Props<T> {
  data: T[];
  dataKey: string;
  mouseMove(args: any): void;
  mouseLeave(): void;
  height: number;
  notool: boolean;
  nofill: boolean;
  inheritedScale: ScaleFunction;
  type: string;
  barProps: Object;
  margin: Margin;
  width: number;
  axisId: string;
  orientation: string;
  xKey: string;
  declareBar(): void;
  noTool: boolean;
  yKey: string;
  yPoints: any[];
  xPoints: any[];
  inverted: boolean;
  color: string;
}

export default BarChart
