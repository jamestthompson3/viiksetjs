// @flow
import * as React from 'react'
import isEmpty from 'lodash/isEmpty'

import { getX, getY, extractLabels } from '../../utils/dataUtils'
import { determineXScale, determineYScale } from '../../utils/chartUtils'
import withParentSize from '../Responsive/withParentSize'
import { type Margin, type ScaleFunction } from '../../types/index'

const margin = { top: 18, right: 15, bottom: 15, left: 30 }

class DataContext extends React.PureComponent<Props, State> {
  static defaultProps = {
    data: [],
    margin: margin
  }

  state = {
    dataCalculated: false,
    width: null,
    height: null,
    yPoints: null,
    xPoints: null,
    xScale: null,
    yScale: null,
    yScales: null,
    dataKeys: null,
    biaxialChildren: null
  }

  componentDidMount() {
    this.calculateData()
  }

  componentDidUpdate(prevProps) {
    const dataWasChanged = prevProps.data !== this.props.data
    const widthWasChanged = prevProps.size && prevProps.size.width !== this.props.size.width
    const heightWasChanged =
      prevProps.size.height !== 0 && prevProps.size.height !== this.props.size.height
    const typeWasChanged = prevProps.type !== this.props.type

    if (dataWasChanged || widthWasChanged || heightWasChanged || typeWasChanged) {
      return this.calculateData()
    }
  }

  calculateData = () => {
    const { size, xKey, yKey, type, margin, data, orientation } = this.props

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
    return this.setState({
      width,
      height,
      xPoints,
      xScale,
      yScale,
      yPoints,
      dataKeys,
      dataCalculated: true
    })
  }

  render() {
    const {
      width,
      height,
      xScale,
      yScale,
      yScales,
      biaxialChildren,
      dataCalculated,
      dataKeys,
      yPoints,
      xPoints
    } = this.state
    const { data, children, size, type, orientation, xKey, yKey, margin } = this.props
    return (
      dataCalculated &&
      children({
        xScale,
        size,
        type,
        orientation,
        xKey,
        yKey,
        margin,
        dataKeys,
        biaxialChildren,
        data,
        width,
        height,
        yPoints,
        xPoints,
        yScale,
        yScales
      })
    )
  }
}

export type Size = {
  width: number,
  height: number
}

type State = {
  dataCalculated: boolean,
  width: ?number,
  height: ?number,
  xScale: ?ScaleFunction,
  yScale: ?ScaleFunction,
  yScales: ?{ [key: string]: ScaleFunction } | ?false,
  biaxialChildren: ?boolean,
  dataKeys: ?(string[]),
  yPoints: ?(number[]) | ?(string[]),
  xPoints: ?(number[]) | ?(string[])
}

type Props = {
  data: any[],
  type: 'ordinal' | 'linear',
  orientation: 'horizontal',
  children: React.Node[],
  xKey: string,
  yKey: string,
  size: Size,
  margin: Margin
}

export default withParentSize(DataContext)
