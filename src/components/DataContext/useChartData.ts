import { useState, useEffect } from 'react'
import isEmpty from 'lodash/isEmpty'

import { getX, getY, extractLabels } from '../../utils/dataUtils'
import { determineXScale, determineYScale } from '../../utils/chartUtils'
import { Margin, ScaleFunction, Size } from '../../types/index'

const DEFAULT_MARGIN = { top: 18, right: 15, bottom: 15, left: 30 }

export function useChartData({
  size,
  xKey,
  yKey,
  type,
  margin = DEFAULT_MARGIN,
  data,
  orientation
}: Props) {
  const [chartData, setChartData] = useState<State>({
    width: null,
    height: null,
    xPoints: null,
    xScale: null,
    yScale: null,
    yPoints: null,
    dataKeys: null
  })
  useEffect(() => {
    if (isEmpty(data)) {
      // eslint-disable-next-line
      process.env.NODE_ENV !== 'production' && console.warn('Data is empty, cannot calculate chart')
      return null
    }

    const dataKeys = extractLabels(data[0])
    const width = size.width - margin.left - margin.right
    const height = size.height === 0 ? 300 : size.height - margin.top - margin.bottom
    const xPoints = getX(data, xKey)
    const yPoints = getY(data, yKey)
    const yScale = determineYScale({ type, yPoints, height, margin, orientation })
    const xScale = determineXScale({ type, width, xPoints, margin })
    setChartData({
      width,
      height,
      xPoints,
      xScale,
      yScale,
      yPoints,
      dataKeys
    })
  }, [data, size, type, margin, orientation, xKey, yKey])
  return chartData
}

interface State {
  width?: number;
  height?: number;
  xScale?: ScaleFunction;
  yScale?: ScaleFunction;
  yScales?: { [key: string]: ScaleFunction } | false;
  biaxialChildren?: boolean;
  dataKeys?: string[];
  yPoints?: number[] | string[];
  xPoints?: number[] | string[];
}

interface Props {
  data: any[];
  type: 'ordinal' | 'linear';
  orientation: 'horizontal';
  children?(props: object): (React.ReactNode[]);
  xKey: string;
  yKey: string;
  size: Size;
  margin: Margin;
}
