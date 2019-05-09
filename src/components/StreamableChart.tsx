import * as React from 'react'
import { Group } from '@vx/group'
import isEmpty from 'lodash/isEmpty'

import { formatTicks, formatXTicks } from '../utils/formatUtils'
import { biaxial } from '../utils/chartUtils'
import { ScaleFunction, RenderContainerProps, Axis, FromStreamArgs } from '../types/index'
import withStream from './Streaming/withStream'
import { LeftAxisReturn, BottomAxisReturn, buildAxis, buildGrid } from './common'
import { useChartData } from './DataContext/useChartData'

const margin = { top: 18, right: 15, bottom: 15, left: 30 }

const DefaultLoadingMessage: React.SFC = () => <h2>Loading data...</h2>

const defaultAxes: Axis = {
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

function StreamableChart<T>({
  connection,
  mapStream,
  persist,
  streamParser,
  fromStream,
  stopPersist,
  data,
  children,
  determineViewBox,
  xKey,
  axes,
  yKey,
  type,
  noGrid,
  gridStroke,
  size,
  loadingMessage: Loading,
  orientation,
  color
}: Props<T>) {
  const chart = React.useRef(null)
  const socket = React.useRef()
  const { xScale, width, height, yPoints, yScale } = useChartData({
    size,
    margin,
    data,
    xKey,
    yKey,
    type,
    orientation
  })
  React.useEffect(() => {
    if (!connection) {
      // eslint-disable-next-line
      console.error('Connection string is needed for StreamableChart')
      return null
    }

    socket.current = new window.WebSocket(connection)

    if (this.socket.current) {
      this.socket.current.onclose = () => console.warn('connection closed')
      this.socket.current.onmessage = message =>
        fromStream({
          message: streamParser(message),
          mapStream,
          persist
        })
    }
    return socket.current.close()
  }, [])

  if (isEmpty(data)) return <Loading />

  if (stopPersist && data.length >= stopPersist) {
    socket.current && socket.current.close()
  }

  const biaxialChildren = children && biaxial(children)
  const LeftAxis = buildAxis(biaxialChildren, 'left', defaultAxes, axes, color) as LeftAxisReturn
  const BottomAxis = buildAxis(biaxialChildren, 'bottom', defaultAxes, axes, color) as BottomAxisReturn
  const Grid = buildGrid(gridStroke, noGrid)
    return (
    <svg
      width={size.width}
      height={size.height}
      preserveAspectRatio="none"
      viewBox={
        determineViewBox ? determineViewBox({ size, margin }) : `-10 0 ${size.width} ${height}`
      }
      ref={chart}
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
          inheritedScale: yScale
        })
      )}
      <Group left={margin.left}>
        <Grid yScale={yScale} width={width} left={margin.left} />
          <LeftAxis {...{ type, orientation, color, yPoints, height, margin }} />
      </Group>

      <BottomAxis scale={xScale} height={height} margin={margin} />
    </svg>
  )
}

StreamableChart.defaultProps = {
  data: [],
  persist: 2500,
  color: '#000',
  axes: defaultAxes,
  stroke: '#000',
  loadingMessage: DefaultLoadingMessage,
  streamParser: message => message,
  mapStream: (data: any[], message: any) => [...data, message],
  margin: margin
}

interface Props<T> extends RenderContainerProps {
  data: T[];
  persist: number;
  fromStream(args: FromStreamArgs): void;
  xScale: ScaleFunction;
  yScale: ScaleFunction;
  loadingMessage: React.ReactNode;
  yScales: { [key: string]: ScaleFunction };
  yPoints: any[];
  chartData: any[];
  stopPersist: number;
  connection: string;
  streamParser: (message: any) => any;
  mapStream(data: any, message: string): any[];
}

export default withStream(StreamableChart)
