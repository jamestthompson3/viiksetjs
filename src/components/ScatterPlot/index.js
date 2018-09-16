// @flow
import * as React from 'react'
import get from 'lodash/get'

import { StyledPoint } from '../styledComponents'
import { extractX } from '../../utils/dataUtils'
import { determineYScale } from '../../utils/chartUtils'
import { type RenderedChildProps } from '../../types/index'

class ScatterPlot extends React.Component<Props> {
  static defaultProps = {
    color: '#000',
    stroke: '#000',
    opacity: 0.8,
    radius: 8
  }

  shouldComponentUpdate(prevProps: Props) {
    return this.props.yPoints !== prevProps.yPoints || prevProps.dataKey !== this.props.dataKey
  }

  render() {
    const {
      data,
      color,
      dataKey,
      xScale,
      xKey,
      height,
      margin,
      opacity,
      radius,
      inheritedScale,
      axisId,
      type,
      stroke,
      pointProps
    } = this.props

    // Check if data exists
    if (data.map(item => get(item, dataKey)).includes(undefined)) {
      // eslint-disable-next-line
      process.env.NODE_ENV !== 'production' &&
        console.warn(`ScatterPlot: No data found with dataKey ${dataKey}`)
      return null
    }

    if (axisId && data.map(item => get(item, axisId)).includes(undefined)) {
      // eslint-disable-next-line
      process.env.NODE_ENV !== 'production' &&
        console.warn(`ScatterPlot: No data found with axisId ${axisId}`)
      return null
    }

    const getAxis = () => (!axisId ? inheritedScale : yScale)
    const dataPoints = data.map(item => get(item, dataKey))
    const yPoints = d => getAxis()(get(d, dataKey))
    const xPoints = d => xScale(xKey ? get(d, xKey) : extractX(d)[0])
    const yScale = determineYScale({
      type: type || 'linear',
      yPoints: dataPoints,
      height,
      margin
    })
    return data.map((d, i) => (
      <StyledPoint
        key={i}
        x={xPoints(d)}
        y={yPoints(d)}
        radius={radius}
        stroke={stroke}
        opacity={opacity}
        color={color}
        {...pointProps}
      />
    ))
  }
}

type Props = {
  radius: number,
  stroke: string,
  pointProps: number,
  opacity: number,
  ...RenderedChildProps
}

export default ScatterPlot
