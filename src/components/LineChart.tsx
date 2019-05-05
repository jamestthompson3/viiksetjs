import * as React from 'react'
import get from 'lodash/get'
import { curveMonotoneX } from '@vx/curve'

import {
  StyledGradient,
  StyledPatternLines,
  StyledLinePath,
  StyledAreaClosed
} from './styledComponents'
import { extractX } from '../utils/dataUtils'
import { determineYScale } from '../utils/chartUtils'
import { RenderedChildProps } from '../types/index'

function LineChart({
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
}): Props {
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

  const dataPoints = data.map(item => get(item, dataKey))
  const getAxis = () => (!axisId ? inheritedScale : yScale)
  const yScale = determineYScale({
    type: type || 'linear',
    yPoints: dataPoints,
    height,
    margin
  })
  const xPoints = d => xScale(xKey ? get(d, xKey) : extractX(d)[0])
  const yPoints = d => getAxis()(get(d, dataKey))
  const gradientKey = typeof dataKey === 'string' ? dataKey.split(' ').join('') : dataKey
  const findFill = (gradient: boolean) =>
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
            fill={findFill()}
            x={xPoints}
            curve={curveMonotoneX}
            {...areaProps}
          />
        ))}
    </>
  )
}

LineChart.defaultProps = {
  color: 'rgb(0, 157, 253)',
  nofill: false,
  nopattern: false
}

interface Props extends RenderedChildProps {
  areaProps: Object;
  lineProps: Object;
  gradientOpacity: number[];
  nofill: boolean;
  nopattern: boolean;
}

export default React.memo(LineChart)
