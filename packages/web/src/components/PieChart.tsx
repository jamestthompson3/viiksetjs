import * as React from 'react';
import { Group } from '@vx/group';
import get from 'lodash/get';
import styled from 'styled-components';

import {
  StyledText,
  StyledPie,
  findColor,
  defaultTooltipContent,
  TooltipRendererProps,
} from './styledComponents';
import withParentSize from './Responsive/withParentSize';
import {
  RenderedChildProps,
  ToolTipData,
  Size,
  GenericData,
  TooltipUpdateData,
} from '../typedef';

interface LabelProps {
  x: number;
  y: number;
  labelProps: Object;
  labelText: string;
}

const Label = ({ x, y, labelProps, labelText }: LabelProps) => (
  <StyledText x={x} y={y} {...labelProps}>
    {labelText}
  </StyledText>
);

Label.defaultProps = {
  labelProps: {
    fill: 'black',
    textAnchor: 'middle',
    dy: '.33em',
    fontSize: 10,
  },
};

interface TooltipContainerProps {
  mouseY: number;
  mouseX: number;
  height: number;
  width: number;
}
const TooltipContainer = styled.div.attrs((p: TooltipContainerProps): any => ({
  style: {
    top: p.mouseY - p.height,
    left: p.mouseX + p.width / 2,
  },
}))`
  display: flex;
  flex-direction: column;
  padding: 8px;
  position: relative;
  border-radius: 3px;
  background: #333;
  color: #fff;
  width: 200px;
  border: ${p => `2px solid ${findColor(p)}`};
  font-size: 12px;
  pointer-events: none;
`;

const defaultPieTooltip: React.FunctionComponent<
  Partial<TooltipRendererProps>
> = ({ tooltipData, height, width, mouseX, mouseY, color, tooltipContent }) => (
  <TooltipContainer {...{ mouseX, height, width, mouseY, color }}>
    {tooltipContent && tooltipContent({ tooltipData })}
  </TooltipContainer>
);

const PieBody = React.memo(function Pie({
  data,
  dataKey,
  width,
  height,
  innerRadius,
  outerRadius,
  pieProps,
  calcRadius,
  determineOpacity,
  mouseMove,
  mouseLeave,
  color,
  labelKey,
  labelProps,
}: BodyProps) {
  return (
    <StyledPie
      data={data}
      pieValue={(d: { dataKey?: string }) => get(d, dataKey)}
      innerRadius={calcRadius(width, height) - innerRadius}
      outerRadius={calcRadius(width, height) - outerRadius}
      {...pieProps}
    >
      {(pie: any) =>
        pie.arcs.map((arc: any, i: number) => {
          const opacity = determineOpacity(arc.data);
          const [x, y] = pie.path.centroid(arc);
          const { startAngle, endAngle } = arc;
          const hasSpaceForLabel = endAngle - startAngle >= 0.1;
          return (
            <g
              key={`${arc.data.label}-${i}`}
              onMouseEnter={() => mouseMove({ arc, pie })}
              onMouseLeave={() => mouseLeave()}
            >
              <path
                d={pie.path(arc)}
                fill={color as string}
                fillOpacity={opacity}
              />
              {hasSpaceForLabel && (
                <Label
                  x={x}
                  y={y}
                  labelText={get(arc.data, labelKey)}
                  {...labelProps}
                />
              )}
            </g>
          );
        })
      }
    </StyledPie>
  );
});

const PieChart: React.FunctionComponent<Props> = ({
  color,
  data,
  dataKey,
  labelKey,
  labelProps,
  determineOpacity,
  margin,
  innerRadius,
  tooltipRenderer,
  tooltipContent,
  outerRadius,
  size,
  pieProps,
}) => {
  const [tooltipData, updateTooltip] = React.useState<
    Partial<TooltipUpdateData>
  >({});
  const mouseMove = ({ arc, pie }: { arc: any; pie: any }) => {
    const { data } = arc;
    const [x, y] = pie.path.centroid(arc);
    return updateTooltip({
      calculatedData: data,
      mouseX: x,
      mouseY: y,
      showTooltip: true,
    });
  };

  const mouseLeave = () => updateTooltip({});

  const { calculatedData, mouseX, mouseY, showTooltip } = tooltipData;
  const calcRadius = (width: number, height: number): number =>
    Math.min(width, height) / 2;
  const width = size.width - margin.left - margin.right;
  const height =
    size.height === 0 ? 300 : size.height - margin.top - margin.bottom;
  return (
    <div style={{ width: size.width, height: size.height }}>
      <svg width={width} height={height}>
        <Group top={height / 2} left={width / 2}>
          <PieBody
            {...{
              data,
              dataKey,
              width,
              height,
              innerRadius,
              outerRadius,
              pieProps,
              calcRadius,
              determineOpacity,
              mouseMove,
              mouseLeave,
              color,
              labelKey,
              labelProps,
            }}
          />
        </Group>
      </svg>
      {showTooltip &&
        tooltipRenderer({
          ...{
            tooltipData: calculatedData,
            tooltipContent,
            mouseX,
            mouseY,
            height,
            color,
            width,
          },
        })}
    </div>
  );
};

PieChart.defaultProps = {
  determineOpacity: () => 0.5,
  tooltipRenderer: defaultPieTooltip,
  tooltipContent: defaultTooltipContent,
  innerRadius: 0,
  outerRadius: 0,
  margin: { top: 10, bottom: 10, left: 10, right: 10 },
};

interface Props extends RenderedChildProps {
  labelKey: string;
  determineOpacity(arg: any): number;
  mouseX: number;
  mouseY: number;
  labelProps: GenericData;
  tooltipRenderer(arg: Partial<ToolTipData>): React.ReactNode;
  tooltipContent(tooltipData: Object): React.ReactNode;
  showTooltip: boolean;
  innerRadius: number;
  outerRadius: number;
  pieProps: Object;
  size: Size;
}

interface BodyProps {
  data: GenericData[];
  dataKey: string;
  width: number;
  height: number;
  innerRadius: number;
  outerRadius: number;
  pieProps: Object;
  calcRadius(width: number, height: number): number;
  determineOpacity(arg: any): number;
  mouseMove(arg: any): void;
  mouseLeave(): void;
  color: string | ((arg: any) => string);
  labelKey: string;
  labelProps: Object;
}

export default withParentSize(PieChart);
