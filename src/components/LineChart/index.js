// @flow
import * as React from 'react'
import get from 'lodash/get'
import { curveMonotoneX } from '@vx/curve'

import {
  StyledGradient,
  StyledPatternLines,
  StyledLinePath,
  StyledAreaClosed
} from '../styledComponents'
import { extractX } from '../../utils/dataUtils'
import { determineYScale } from '../../utils/chartUtils'
import { type RenderedChildProps } from '../../types/index'

class LineChart extends React.Component<Props> {
  static defaultProps = {
    color: 'rgb(0, 157, 253)',
    nofill: false,
    nopattern: false
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
      nofill,
      height,
      margin,
      nopattern,
      inheritedScale,
      axisId,
      type,
      areaProps,
      lineProps,
      gradientOpacity
    } = this.props

    // Check if data exists
    if (data.map(item => get(item, dataKey)).includes(undefined)) {
      // eslint-disable-next-line
      process.env.NODE_ENV !== 'production' &&
        console.warn(`LineChart: No data found with dataKey ${dataKey}`)
      return null
    }

    if (axisId && data.map(item => get(item, axisId)).includes(undefined)) {
      // eslint-disable-next-line
      process.env.NODE_ENV !== 'production' &&
        console.warn(`LineChart: No data found with axisId ${axisId}`)
      return null
    }

    const yPoints = d => get(d, dataKey)
    const xPoints = d => (xKey ? get(d, xKey) : extractX(d))[0]
    const dataPoints = data.map(item => get(item, dataKey))
    const yScale = determineYScale({
      type: type || 'linear',
      yPoints: dataPoints,
      height,
      margin
    })
    const gradientKey = typeof dataKey === 'string' ? dataKey.split(' ').join('') : dataKey
    const getAxis = () => (!axisId ? inheritedScale : yScale)
    const findFill = gradient =>
      gradient ? `url(#gradient${gradientKey})` : `url(#dlines${gradientKey})`
    return (
      <>
        {!nofill && (
          <>
            <StyledGradient opacity={gradientOpacity} color={color} id={`gradient${gradientKey}`} />
            <StyledPatternLines color={color} id={`dlines${gradientKey}`} />
          </>
        )}
        <StyledLinePath
          {...{ data, color }}
          y={yPoints}
          x={xPoints}
          yScale={getAxis()}
          xScale={xScale}
          curve={curveMonotoneX}
          {...lineProps}
        />
        {!nofill && (
          <StyledAreaClosed
            {...{ data, color }}
            y={yPoints}
            x={xPoints}
            fill={findFill('gradient')}
            yScale={getAxis()}
            xScale={xScale}
            curve={curveMonotoneX}
            {...areaProps}
          />
        )}
        {nopattern ||
          (!nofill && (
            <StyledAreaClosed
              {...{ data, color }}
              y={yPoints}
              yScale={getAxis()}
              xScale={xScale}
              fill={findFill()}
              x={xPoints}
              curve={curveMonotoneX}
              {...areaProps}
            />
          ))}
      </>
    )
  }
}

type Props = {
  areaProps: Object,
  lineProps: Object,
  gradientOpacity: number[],
  nofill: boolean,
  nopattern: boolean,
  ...RenderedChildProps
}

export default LineChart
