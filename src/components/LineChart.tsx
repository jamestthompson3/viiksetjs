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

function LineChart<T>({
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
}: Props) {
  // TODO think of a better data structure to store these in from useChartData?
  // Seems inefficient to map through the dataset more than once
  const dataPoints = data.map((item: T) => get(item, dataKey))
  React.useEffect(() => {
    // eslint-disable-next-line
    if (process.env.NODE_ENV !== 'production') {
      if (dataPoints.includes(undefined)) {
        console.warn(`LineChart: No data found with dataKey ${dataKey}`)
      }
    }
  }, [])

  const getAxis = () => (!axisId ? inheritedScale : yScale)
  const yScale = determineYScale({
    type: type || 'linear',
    yPoints: dataPoints,
    height,
    margin
  })
  const xPoints = (d: T) => xScale(xKey ? get(d, xKey) : extractX(d)[0])
  const yPoints = (d: T) => getAxis()(get(d, dataKey))
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
          fill={findFill(true)}
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
            fill={findFill(false)}
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