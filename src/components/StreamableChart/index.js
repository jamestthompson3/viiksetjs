// @flow
import * as React from 'react'
import { Group } from '@vx/group'
import isEmpty from 'lodash/isEmpty'

import { formatTicks, formatXTicks } from '../../utils/formatUtils'
import { determineYScale } from '../../utils/chartUtils'
import { type Margin, type ScaleFunction } from '../../types/index'
import DataContext from '../DataContext'
import withStream from '../Streaming/withStream'
import { type Size } from '../DataContext'
import withParentSize from '../Responsive/withParentSize'
import { StyledGridRows, StyledLeftAxis, StyledBottomAxis } from '../styledComponents/index'

const margin = { top: 18, right: 15, bottom: 15, left: 30 }

const DefaultLoadingMessage = () => <h2>Loading data...</h2>

class StreamableChart extends React.Component<Props, State> {
  socket = null

  chart = null

  axes = {
    x: {
      tickLabelProps: () => ({
        dy: '-0.25rem',
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
        dy: '-0.25rem',
        dx: '-0.75rem',
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

  static defaultProps = {
    data: [],
    persist: 2500,
    color: '#000',
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

  render() {
    const {
      children,
      determineViewBox,
      xKey,
      yKey,
      formatY,
      formatX,
      labelY,
      type,
      labelYProps,
      labelX,
      labelXProps,
      xTickLabelProps,
      yTickLabelProps,
      numXTicks,
      numYTicks,
      stroke,
      nogrid,
      noYAxis,
      loadingMessage: Loading,
      orientation,
      data,
      color
    } = this.props
    return !isEmpty(data) ? (
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
              {!nogrid && (
                <StyledGridRows
                  scale={yScale}
                  {...{ stroke }}
                  width={width - margin.left}
                  numTicks={3}
                />
              )}
              {biaxialChildren || noYAxis || (
                <StyledLeftAxis
                  scale={determineYScale({
                    type,
                    orientation,
                    yPoints,
                    height,
                    margin
                  })}
                  {...{ color, numTicks: numYTicks, tickLabelProps: yTickLabelProps }}
                  hideTicks
                  tickFormat={formatY}
                  label={labelY || ''}
                  labelProps={labelYProps}
                />
              )}
            </Group>
            <StyledBottomAxis
              scale={xScale}
              {...{ color, height, margin, numTicks: numXTicks, tickLabelProps: xTickLabelProps }}
              hideTicks
              tickFormat={formatX}
              label={labelX || ''}
              labelProps={labelXProps}
            />
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

export default withStream(withParentSize(StreamableChart))
