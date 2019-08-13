import * as React from 'react';
import { Group } from '@vx/group';
import isEmpty from 'lodash/isEmpty';

import {
  formatTicks,
  ScaleFunction,
  formatXTicks,
  biaxial,
  State,
  prepChartData,
  Axis,
  recursiveCloneChildren,
} from '@viiksetjs/utils';
import { RenderContainerProps, FromStreamArgs, GenericData } from '../typedef';
import {
  LeftAxisRendererProps,
  BottomAxisRendererProps,
  buildAxis,
  buildGrid,
} from './common/index';
import withParentSize from './Responsive/withParentSize';
import { withStream } from './withStream';

const margin = { top: 18, right: 15, bottom: 15, left: 30 };

const DefaultLoadingMessage: React.FunctionComponent = () => (
  <h2>Loading data...</h2>
);

const defaultAxes: Axis = {
  x: {
    tickLabelProps: () => ({
      fontWeight: 400,
      strokeWidth: '0.5px',
      textAnchor: 'start',
      fontSize: 12,
    }),
    numTicks: 6,
    label: '',
    stroke: '#000',
    labelProps: {
      fontSize: 12,
      textAnchor: 'middle',
      fill: 'black',
      dy: '-0.5rem',
    },
    tickFormat: formatXTicks,
  },
  y: {
    tickLabelProps: () => ({
      strokeWidth: '0.5px',
      fontWeight: 400,
      textAnchor: 'end',
      fontSize: 12,
    }),
    numTicks: 4,
    label: '',
    stroke: '#000',
    tickFormat: formatTicks,
    labelProps: { fontSize: 12, textAnchor: 'middle', fill: 'black' },
  },
};

const StreamableChart: React.FunctionComponent<Props> = ({
  connection,
  mapStream,
  persist,
  data,
  fromStream,
  streamParser,
  stopPersist,
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
  color,
}) => {
  const [chartData, setChartData] = React.useState<State<any, any>>({
    width: 0,
    height: 0,
    yPoints: [],
    xPoints: [],
  });
  const chart = React.useRef(null);
  React.useEffect(() => {
    const chartData = prepChartData({
      data,
      size,
      xKey,
      yKey,
      margin,
      type,
      orientation,
    });
    setChartData(chartData);
  }, [data, size, type, margin, orientation, xKey, yKey]);

  React.useEffect(() => {
    if (!connection) {
      console.error('Connection string is needed for StreamableChart');
      return;
    }

    const socket = new WebSocket(connection);

    if (stopPersist && data.length >= stopPersist) {
      socket.close();
    }
    socket.onclose = () => console.warn('connection closed');
    socket.onmessage = message =>
      fromStream({
        message: streamParser(message),
        mapStream,
        persist,
      });
    return () => socket.close();
  }, []);

  if (isEmpty(data)) return <Loading />;

  const { width, height, yPoints, yScale, xScale } = chartData;
  if (!yScale) {
    return null;
  }
  const biaxialChildren = biaxial(children);
  const LeftAxis = buildAxis(
    biaxialChildren,
    'left',
    defaultAxes,
    axes,
    color
  ) as React.FunctionComponent<LeftAxisRendererProps>;
  const BottomAxis = buildAxis(
    biaxialChildren,
    'bottom',
    defaultAxes,
    axes,
    color
  ) as React.FunctionComponent<BottomAxisRendererProps>;
  const Grid = buildGrid(gridStroke, noGrid);
  return (
    <svg
      width={size.width}
      height={size.height}
      preserveAspectRatio="none"
      viewBox={
        determineViewBox
          ? determineViewBox({ size, margin })
          : `-10 0 ${size.width} ${height}`
      }
      ref={chart}
    >
      <Group left={margin.left}>
        <Grid yScale={yScale} width={width} left={margin.left} />
        <LeftAxis {...{ type, orientation, color, yPoints, height, margin }} />
      </Group>
      {recursiveCloneChildren(children, {
        data,
        xScale,
        margin,
        height,
        noTool: true,
        yPoints,
        width,
        xKey,
        inheritedScale: yScale,
      })}

      <BottomAxis scale={xScale} height={height} margin={margin} />
    </svg>
  );
};

StreamableChart.defaultProps = {
  persist: 2500,
  color: '#000',
  axes: defaultAxes,
  stroke: '#000',
  loadingMessage: DefaultLoadingMessage,
  streamParser: (message: any) => message,
  mapStream: (message: any) => message,
  margin: margin,
};

interface Props extends RenderContainerProps {
  persist: number;
  fromStream(args: FromStreamArgs): void;
  xScale: ScaleFunction;
  yScale: ScaleFunction;
  loadingMessage: React.FunctionComponent;
  yScales: { [key: string]: ScaleFunction };
  yPoints: any[];
  data: GenericData[];
  stopPersist: number;
  connection: string;
  streamParser(message: any): any;
  mapStream(message: any): any;
}

export default withStream(withParentSize(StreamableChart));
