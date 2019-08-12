/// <reference path="../modules.d.ts"/>
import * as React from 'react';
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { bisect } from 'd3-array';
import flow from 'lodash/flow';
import head from 'lodash/head';
import get from 'lodash/get';
import merge from 'lodash/merge';
import { localPoint } from '@vx/event';

import {
  extractX,
  MouseMove,
  extractY,
  createLinearScales,
  formatTicks,
  formatXTicks,
  findTooltipX,
  recursiveCloneChildren,
  biaxial,
  prepChartData,
  InheritedChartProps,
  Axis,
  Margin,
  State,
} from '@viiksetjs/utils';
import {
  RenderContainerProps,
  GenericData,
  ToolTipData,
  TooltipUpdateData,
  RenderedWithTooltipProps,
} from '../typedef';
import withParentSize from './Responsive/withParentSize';
import {
  Indicator,
  defaultTooltipRenderer,
  defaultTooltipContent,
} from './styledComponents';

import {
  buildAxis,
  buildGrid,
  LeftAxisRendererProps,
  BottomAxisRendererProps,
} from './common/index';

const DEFAULT_MARGIN: Margin = { top: 18, right: 15, bottom: 15, left: 30 };

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
    tickStroke: 'transparent',
    labelProps: { fontSize: 12, textAnchor: 'middle', fill: 'black', dy: -10 },
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
    tickStroke: 'transparent',
    tickFormat: formatTicks,
    labelProps: { fontSize: 12, textAnchor: 'middle', fill: 'black' },
  },
};

const defaultTooltip: TooltipProps<GenericData> = {
  indicator: Indicator,
  renderer: defaultTooltipRenderer,
  content: defaultTooltipContent,
  styles: { wrapper: {}, content: {} },
};

function ChartArea({
  children,
  determineViewBox,
  data,
  xKey,
  yKey,
  type,
  size,
  noGrid = false,
  orientation,
  axes,
  stroke,
  tooltip,
  noTool = false,
  gridStroke,
  color,
  margin = DEFAULT_MARGIN,
  glyphRenderer,
}: Props) {
  const chart = React.useRef(null);
  const [chartData, setChartData] = React.useState<State<any, any>>({
    width: 0,
    height: 0,
    yPoints: [],
    xPoints: [],
  });
  const [bar, setBar] = React.useState(false);
  const Grid = buildGrid(gridStroke, noGrid);
  React.useEffect(() => {
    const chartData = prepChartData<any, any>({
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
  const [tooltipData, updateTooltip] = React.useState<
    Partial<TooltipUpdateData>
  >({});

  // To prevent tooltips from not showing on bar chart due to minification changing names
  const declareBar = () => setBar(true);
  const mouseMove = ({
    event,
    xPoints,
    xScale,
    yScale,
    yScales,
    dataKeys,
    datum,
  }: Partial<MouseMove>): void => {
    if (tooltip === null || noTool || !xPoints) return;

    const svgPoint = localPoint(chart.current, event);
    const mouseX = get(svgPoint, 'x');
    const mouseY = get(svgPoint, 'y');

    // Case for data contained in bar / pie charts:
    // there won't be an associated value based on precise
    // cursor position
    if (datum) {
      return updateTooltip({
        calculatedData: datum,
        x: mouseX,
        mouseX,
        mouseY,
        showTooltip: true,
      });
    }

    const xValueOffset = biaxial(children) ? 0 : margin.right;
    const xValue = xScale.invert(get(svgPoint, 'x') - xValueOffset);

    return flow(
      (xValue: number) => bisect(xPoints as number[], xValue),
      (index: number) => {
        // Find the closest data point based on the actual mouse position
        const bounds = { dLeft: data[index - 1], dRight: data[index] };
        // If the calculated xValue minus the value to the left is greater than
        // The indexed value minuse the calcuated value, take the right hand
        // value if available. If not, take the left hand value if available.
        return xValue - (xPoints[index - 1] as number) >
          (xPoints[index] as number) - xValue
          ? bounds.dRight || bounds.dLeft
          : bounds.dLeft || bounds.dRight;
      },
      (calculatedData: { [key: string]: any }) => {
        const calculatedX = head(extractX(calculatedData, xKey));
        const x: number = findTooltipX({ calculatedX, xScale });
        const yCoords =
          yScales && dataKeys
            ? dataKeys.map((key: string) => yScales[key](calculatedData[key]))
            : extractY(calculatedData).map(item => yScale(item));
        updateTooltip({
          calculatedData,
          x,
          showTooltip: true,
          mouseX,
          mouseY,
          yCoords,
        });
      }
    )(xValue);
  };

  const mouseLeave = () => {
    updateTooltip({});
  };

  const {
    calculatedData,
    yCoords,
    x,
    mouseX,
    mouseY,
    showTooltip,
  } = tooltipData;

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
  const {
    indicator: Indicator,
    renderer: tooltipRenderer,
    styles: tooltipStyles,
    content: tooltipContent,
  } = merge({}, defaultTooltip, tooltip);
  // if we haven't set scales, we know it's not ready to render the chart
  if (!chartData.xScale) {
    return null;
  }
  const {
    xScale,
    dataKeys,
    width,
    height,
    yPoints,
    xPoints,
    yScale,
  } = chartData;
  return (
    <div
      style={{ width: size.width, height: size.height }}
      id="viiksetjsWrapperDiv"
    >
      <svg
        width={size.width}
        height={size.height}
        preserveAspectRatio="none"
        viewBox={
          determineViewBox
            ? determineViewBox({ size, margin })
            : `-10 0 ${size.width} ${size.height}`
        }
        ref={chart}
      >
        <Group left={biaxialChildren ? 0 : margin.right}>
          <Group left={margin.left}>
            <Grid yScale={yScale} width={width} left={margin.left} />
            <LeftAxis {...{ type, orientation, yPoints, height, margin }} />
          </Group>
          {recursiveCloneChildren(children, {
            data,
            xScale,
            margin,
            height,
            noTool,
            axes,
            yPoints,
            xPoints,
            width,
            declareBar,
            type,
            orientation,
            mouseMove,
            mouseLeave,
            xKey,
            yKey,
            inheritedScale: yScale,
          } as InheritedChartProps)}
          {bar || (
            <Bar
              width={size.width}
              x={0}
              y={0}
              height={height}
              fill="transparent"
              onMouseMove={(event: React.SyntheticEvent) =>
                mouseMove({
                  event,
                  xPoints,
                  xScale,
                  yScale,
                  yScales:
                    biaxialChildren &&
                    createLinearScales(data, dataKeys || [], height, margin),
                  dataKeys,
                })
              }
              onTouchMove={(event: React.SyntheticEvent) =>
                mouseMove({
                  event,
                  xPoints,
                  xScale,
                  yScale,
                  yScales:
                    biaxialChildren &&
                    createLinearScales(data, dataKeys || [], height, margin),
                  dataKeys,
                })
              }
              onTouchEnd={mouseLeave}
              onMouseLeave={mouseLeave}
            />
          )}
          {glyphRenderer &&
            glyphRenderer({ width, height, xScale, yScale, margin })}
          <BottomAxis scale={xScale} height={height} margin={margin} />
          {x && !bar && (
            <Indicator {...{ yCoords, x, stroke, color, height, mouseX }} />
          )}
        </Group>
      </svg>
      {showTooltip &&
        !noTool &&
        tooltipRenderer({
          ...{
            tooltipData: calculatedData,
            tooltipContent,
            yCoords,
            tooltipStyles,
            x,
            mouseX,
            mouseY,
            height,
            color,
          },
        })}
    </div>
  );
}

interface TooltipProps<T> {
  indicator(indicatorProps: RenderedWithTooltipProps): React.ReactElement;
  renderer(renderProps: RenderedWithTooltipProps): React.ReactNode;
  content(tooltipData: T): React.ReactNode;
  styles: {
    wrapper: Object;
    content: Object;
  };
}

interface Props extends RenderContainerProps {
  data: GenericData[];
  noTool: boolean;
  noGrid: boolean;
  calculatedData?: GenericData;
  tooltipData?: GenericData;
  tooltip: Partial<TooltipProps<ToolTipData>>;
}

ChartArea.defaultProps = {
  data: [],
  margin: DEFAULT_MARGIN,
  axes: defaultAxes,
  tooltip: defaultTooltip,
  type: 'linear',
  glyphRenderer: () => null,
};

export default withParentSize(ChartArea);
