// @flow
import * as React from 'react'
import get from 'lodash/get'
import { Group } from '@vx/group'
import { scaleBand, scaleLinear, scaleTime } from 'd3-scale'

import { StyledGradient, StyledBar } from '../styledComponents/index'
import { extractX, getY } from '../../utils/dataUtils'
import { determineYScale, determineXScale } from '../../utils/chartUtils'
import { type ScaleFunction, type Margin } from '../../types/index'

class BarChart extends React.Component<Props> {
  static defaultProps = {
    color: 'rgb(0, 157, 253)',
    nofill: false,
    inverted: false
  }

  componentDidMount() {
    this.props.declareBar()
  }

  shouldComponentUpdate(prevProps: Props) {
    return prevProps.yPoints !== this.props.yPoints || prevProps.dataKey !== this.props.dataKey
  }

  determineScales = ({ type, orientation }: { type: string, orientation: string }) => {
    const { margin, height, width, data, xPoints, yPoints: inheritedPoints, axisId } = this.props
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

      return { xScale, yScale }
    }
  }

  render() {
    const {
      data,
      color,
      dataKey,
      xKey,
      height,
      notool,
      mouseMove,
      mouseLeave,
      nofill,
      type,
      orientation,
      inverted,
      barProps
    } = this.props

    if (data.map(item => get(item, dataKey)).includes(undefined)) {
      // eslint-disable-next-line
      process.env.NODE_ENV !== 'production' &&
        console.warn(`BarChart: No data found with dataKey ${dataKey}`)
      return null
    }

    const { xScale, yScale } = this.determineScales({ type, orientation })
    const xPoint = d => extractX(d, xKey)
    const barHeight = d => yScale(get(d, dataKey))
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
              onMouseMove={() => event => notool || mouseMove({ event, datum: d })}
              onMouseLeave={() => () => mouseLeave()}
              {...barProps}
            />
          </Group>
        ))}
      </>
    )
  }
}

type Props = {
  data: Object[],
  dataKey: string,
  mouseMove: any => mixed,
  mouseLeave: () => mixed,
  height: number,
  notool: boolean,
  nofill: boolean,
  inheritedScale: ScaleFunction,
  type: string,
  barProps: Object,
  margin: Margin,
  width: number,
  axisId: string,
  orientation: string,
  xKey: string,
  declareBar: () => mixed,
  yKey: string,
  yPoints: any[],
  xPoints: any[],
  inverted: boolean,
  color: string
}

export default BarChart
