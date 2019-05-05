// @flow
import * as React from 'react'
import { Group } from '@vx/group'
import isEmpty from 'lodash/isEmpty'
import merge from 'lodash/merge'

import { formatTicks, formatXTicks } from '../utils/formatUtils'
import { biaxial } from '../utils/chartUtils'
import { Margin, ScaleFunction, Size } from '../types/index'
import DataContext from './DataContext'
import withStream from './Streaming/withStream'
import { StyledGridRows } from './styledComponents'
import { buildLeftAxis, buildBottomAxis } from './common'

const margin = { top: 18, right: 15, bottom: 15, left: 30 }

const DefaultLoadingMessage = () => <h2>Loading data...</h2>

const defaultAxes = {
  x: {
    tickLabelProps: () => ({
      fontWeight: 400,
      strokeWidth: '0.5px',
      textAnchor: 'start',
      fontSize: 12
    }),
    numTicks: 6,
    label: '',
    stroke: '#000',
    labelProps: { fontSize: 12, textAnchor: 'middle', fill: 'black', dy: '-0.5rem' },
    tickFormat: formatXTicks
  },
  y: {
    tickLabelProps: () => ({
      strokeWidth: '0.5px',
      fontWeight: 400,
      textAnchor: 'end',
      fontSize: 12
    }),
    numTicks: 4,
    label: '',
    stroke: '#000',
    tickFormat: formatTicks,
    labelProps: { fontSize: 12, textAnchor: 'middle', fill: 'black' }
  }
}

class StreamableChart extends React.Component<Props, State> {
  socket = null

  chart = null

  static defaultProps = {
    data: [],
    persist: 2500,
    color: '#000',
    axes: defaultAxes,
    stroke: '#000',
    loadingMessage: DefaultLoadingMessage,
    streamParser: message => message,
    mapStream: (data, message) => [...data, message],
    margin: margin
  }

  state = {
    biaxialChildren: null,
    width: null,
    height: null
  }

  componentDidMount() {
    const { connection } = this.props

    if (!connection) {
      // eslint-disable-next-line
      console.error('Connection string is needed for StreamableChart')
      return null
    }

    this.socket = new window.WebSocket(connection)
    this.calculateData()
  }

  componentWillUnmount() {
    this.socket && this.socket.close()
  }

  componentDidUpdate() {
    const { stopPersist, data } = this.props

    if (stopPersist && data.length >= stopPersist) {
      this.socket && this.socket.close()
    }
  }

  calculateData = () => {
    const { mapStream, persist, streamParser, fromStream } = this.props

    if (this.socket) {
      this.socket.onclose = () => console.warn('connection closed')
      this.socket.onmessage = message =>
        fromStream({
          message: streamParser(message),
          mapStream,
          persist
        })
    }
  }

  buildAxis = (biaxialChildren, position) => {
    const { axes, color } = this.props
    const { y, x } = merge({}, defaultAxes, axes)

    if (position === 'left' && !biaxialChildren && axes.y !== null) {
      return buildLeftAxis({ y, color })
    }

    if (position === 'bottom' && axes.x !== null) {
      return buildBottomAxis({ x, color })
    }

    return () => null
  }

  buildGrid = () => {
    const { noGrid, gridStroke } = this.props
    if (noGrid) return () => null
    return React.memo(function Grid({ yScale, width, left }) {
      return <StyledGridRows scale={yScale} stroke={gridStroke} width={width - left} />
    })
  }

  render() {
    const {
      children,
      determineViewBox,
      xKey,
      yKey,
      formatY,
      formatX,
      type,
      numYTicks,
      nogrid,
      noYAxis,
      loadingMessage: Loading,
      orientation,
      data,
      color
    } = this.props
    const biaxialChildren = children && biaxial(children)
    const LeftAxis = this.buildAxis(biaxialChildren, 'left')
    const BottomAxis = this.buildAxis(biaxialChildren, 'bottom')
    const Grid = this.buildGrid()
    return isEmpty(data) ? (
      <Loading />
    ) : (
      <DataContext {...{ data, xKey, yKey, type, margin, orientation }}>
        {({ xScale, size, biaxialChildren, width, height, yPoints, yScale }) => (
          <svg
            width={size.width}
            height={size.height}
            preserveAspectRatio="none"
            viewBox={
              determineViewBox
                ? determineViewBox({ size, margin })
                : `-10 0 ${size.width} ${height}`
            }
            ref={svg => (this.chart = svg)}
          >
            {React.Children.map(children, child =>
              React.cloneElement(child, {
                data,
                xScale,
                margin,
                height,
                notool: true,
                yPoints,
                width,
                xKey,
                inheritedScale: yScale,
                formatY,
                numYTicks,
                formatX
              })
            )}
            <Group left={margin.left}>
              {!nogrid && <Grid yScale={yScale} width={width} left={margin.left} />}
              {biaxialChildren || noYAxis || (
                <LeftAxis {...{ type, orientation, color, yPoints, height, margin }} />
              )}
            </Group>

            <BottomAxis scale={xScale} height={height} margin={margin} />
          </svg>
        )}
      </DataContext>
    )
  }
}

type State = {
  biaxialChildren: ?boolean,
  width: ?number,
  height: ?number
}

type Props = {
  data: Object[],
  fromStream: ({
    message: any,
    mapStream: (data: any[], message: any) => any[],
    persist: number
  }) => mixed,
  persist: number,
  xScale: ScaleFunction,
  yScale: ScaleFunction,
  xKey: string,
  loadingMessage: React.Node,
  yKey: string,
  yScales: { [key: string]: ScaleFunction },
  yPoints: any[],
  chartData: any[],
  stopPersist: number,
  connection: string,
  orientation: string,
  streamParser: (message: any) => any,
  size: Size,
  yKey?: string,
  x: number,
  children: React.Node,
  mapStream: (data: any, message: string) => any[],
  color: string,
  stroke: string,
  gridStroke: string,
  type: 'ordinal' | 'linear',
  orientation?: 'horizontal',
  xKey?: string,
  glyphRenderer: ({
    width: number,
    height: number,
    xScale: ScaleFunction,
    yScale: ScaleFunction,
    margin: Margin
  }) => React.Node,
  determineViewBox: ({ size: Size, margin: Margin }) => string,
  nogrid: boolean,
  notool: boolean,
  margin: Margin
}

export default withStream(StreamableChart)
