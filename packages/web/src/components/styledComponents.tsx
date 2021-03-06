/// <reference path="../modules.d.ts"/>
import * as React from 'react';
import styled, { withTheme } from 'styled-components';
import get from 'lodash/get';
import omit from 'lodash/omit';
import { withBoundingRects } from '@vx/bounds';
import { PatternLines } from '@vx/pattern';
import { LinearGradient } from '@vx/gradient';
import { GridRows } from '@vx/grid';
import { AreaClosed, LinePath, Bar, Line, Pie } from '@vx/shape';
import { AxisBottom, AxisLeft, AxisRight } from '@vx/axis';
import { Threshold } from '@vx/threshold';
import { rgba } from 'polished';
import { GenericData, ToolTipData, RenderedWithTooltipProps } from 'typedef';

interface Theme {
  [key: string]: string;
}

interface StyledProps {
  [key: string]: any;
  theme: Theme;
}

const findStroke = (p: StyledProps) =>
  p.theme ? p.theme[p.stroke] || p.stroke || p.theme.primaryColor : p.stroke;

export const findColor = (p: StyledProps) =>
  p.theme ? p.theme[p.color] || p.color || p.theme.primaryColor : p.color;

const findFill = (p: StyledProps) =>
  p.theme ? p.theme[p.fill] || p.fill || p.theme.primaryColor : p.fill;

/**
 * Takes a function and returns the another function containing the correct props for axes
 */
const propsColorSetter = (
  func: Function,
  p: StyledProps,
  value: any,
  index: number
) => {
  const exec = func(value, index);
  const combinedProps = { ...exec, ...p };
  const fill = get(combinedProps, 'fill')
    ? findFill(combinedProps)
    : findColor(combinedProps);
  return { ...exec, fill };
};

/**
 * Takes props from VX components and uses styled-component's theme to return the proper color
 */
const colorSetter = (formatProps: GenericData, p: StyledProps) => {
  /* eslint-disable */
  switch (true) {
    case get(formatProps, 'color') != null:
      return { ...formatProps, stroke: findColor(p), fill: findColor(p) };
    case get(formatProps, 'stroke') != null:
      return { ...formatProps, stroke: findStroke(p), fill: findStroke(p) };
    case get(formatProps, 'fill') != null:
      return { ...formatProps, stroke: findFill(p), fill: findFill(p) };
    default:
      return { ...formatProps, stroke: findColor(p), fill: findColor(p) };
  }
  /* eslint-enable */
};

export const StyledText = withTheme(props => (
  <text
    {...{ ...props, fill: findFill(props) }}
    style={{ pointerEvents: 'none' }}
  />
));

export const StyledPoint = withTheme(props => (
  <circle
    {...{
      ...props,
      r: props.radius,
      cx: props.x,
      cy: props.y,
      stroke: findStroke(props),
      fillOpacity: props.opacity,
      fill: findColor(props),
    }}
  />
));

StyledPoint.defaultProps = {
  strokeWidth: 1,
};

export const StyledLine = withTheme(props => (
  <Line
    {...{ ...props, strokeWidth: props.width, stroke: findStroke(props) }}
  />
));

export const StyledBar = withTheme(props => (
  <Bar {...{ ...props, stroke: findColor(props), fill: findFill(props) }} />
));

StyledBar.defaultProps = {
  rx: 5,
  ry: 0,
};

export const StyledGridRows = withTheme(props => {
  return (
    <GridRows
      {...{ ...props, stroke: findStroke(props) }}
      style={{ pointerEvents: 'none' }}
    />
  );
});

export const StyledLeftAxis = withTheme(props => (
  <AxisLeft
    {...props}
    stroke={findColor(props)}
    tickLabelProps={(value: any, index: number) =>
      propsColorSetter(props.tickLabelProps, props, value, index)
    }
    labelProps={colorSetter(props.labelProps, props)}
  />
));

StyledLeftAxis.defaultProps = {
  strokeWidth: 2,
  tickLabelProps: () => ({ fill: 'black', textAnchor: 'middle', fontSize: 12 }),
};

export const StyledRightAxis = withTheme(props => (
  <AxisRight
    {...props}
    stroke={findColor(props)}
    tickLabelProps={(value: any, index: number) =>
      propsColorSetter(props.tickLabelProps, props, value, index)
    }
    labelProps={colorSetter(props.labelProps, props)}
  />
));

StyledRightAxis.defaultProps = {
  strokeWidth: 2,
  tickLabelProps: () => ({ fill: 'black', textAnchor: 'middle', fontSize: 12 }),
};

export const StyledBottomAxis = withTheme(props => (
  <AxisBottom
    {...{
      ...props,
      stroke: findColor(props),
      tickLabelProps: (value: any, index: number) =>
        propsColorSetter(props.tickLabelProps, props, value, index),
      top: props.height,
      labelProps: colorSetter(props.labelProps, props),
    }}
  />
));

StyledBottomAxis.defaultProps = {
  tickLabelProps: () => ({ fill: 'black', textAnchor: 'middle', fontSize: 12 }),
};

export const StyledPatternLines = withTheme(props => (
  <PatternLines
    {...{ ...props, stroke: rgba(findColor(props), props.opacity) }}
  />
));

StyledPatternLines.defaultProps = {
  opacity: 0.15,
  strokeWidth: 1,
  width: 6,
  height: 6,
  orientation: ['diagonal'],
};

export const StyledGradient = withTheme(props => (
  <LinearGradient
    {...{
      ...props,
      from: rgba(
        findColor(props),
        props.opacity ? props.opacity[0] : props.start
      ),
      to: rgba(findColor(props), props.opacity ? props.opacity[1] : props.end),
    }}
  />
));

StyledGradient.defaultProps = {
  start: 0.35,
  end: 0.05,
};

export const StyledLinePath = withTheme(props => (
  <LinePath {...{ ...props, stroke: findColor(props) }} />
));

StyledLinePath.defaultProps = {
  strokeWidth: '1.5px',
};

export const StyledAreaClosed = withTheme(props => (
  <AreaClosed
    {...{
      ...omit(props, ['xScale']),
      stroke: findColor(props),
      fill: findFill(props),
    }}
  />
));

StyledAreaClosed.defaultProps = {
  strokeWidth: 1,
};

export const StyledPie = withTheme(props => (
  <Pie {...{ ...props, fill: findFill(props) }} />
));

export const StyledThreshold = withTheme(props => (
  <Threshold
    {...{
      ...props,
      belowAreaProps: colorSetter(props.belowAreaProps, {
        ...props,
        ...props.belowAreaProps,
      }),
      aboveAreaProps: colorSetter(props.aboveAreaProps, {
        ...props,
        ...props.aboveAreaProps,
      }),
    }}
  />
));

export const TooltipWrapper = styled.div`
  display: block;
  color: #fff;
  border: 2px solid ${p => p.color || p.theme.primaryColor};
  border-radius: 5px;
  background: #1a2e3c;
  box-shadow: 6px 6px 27px -12px rgba(0, 0, 0, 0.75);
  padding: 8px;
  > * {
    margin: 0;
    font-size: 12px;
  }
`;

const TooltipContainer = styled.div<{ bounds: { left: number; top: number } }>`
  left: ${p => `${p.bounds.left}px`};
  top: ${p => `${p.bounds.top}px`};
  display: inline-flex;
  position: relative;
  pointer-events: none;
  z-index: 10000;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const boundsSetter = ({ left, rect, parentRect }: Bounder) => {
  if (left + rect.width > parentRect.width) {
    return left - rect.width; // case for shifting to the right
  } else if (rect.width / 3 === parentRect.left) {
    return rect.width; // FIXME case for shifting to the left
  } else {
    return left - rect.width / 2.5; // default case
  }
};

interface Bounder {
  rect: ClientRect;
  parentRect: ClientRect;
  left: number;
}

/**
 * TooltipBounder sets bounds for the tooltip and passes them down
 */
interface BounderProps extends Bounder {
  children: React.ReactNode[];
  style?: React.CSSProperties;
}

const TooltipBounder = ({
  children,
  rect,
  parentRect,
  left,
  style,
}: BounderProps) => {
  const getBounds = () => {
    if (rect && parentRect) {
      return {
        left: boundsSetter({ left, rect, parentRect }),
        top: -parentRect.height - rect.height,
      };
    }

    return {
      left: left,
      top: 0,
    };
  };

  return (
    <TooltipContainer
      style={style}
      bounds={getBounds()}
      id="__viiksetjs_tooltipcontainer"
    >
      {children}
    </TooltipContainer>
  );
};

const BoundedTooltip = withBoundingRects(TooltipBounder);

/**
 * Wraps a React component and passes the `getRects` function,
 * allowing the wrapped component to have access to both its own bounding rect
 * and the it's parent's bounding rect
 */
export const withBounds = (component: React.ReactNode) =>
  withBoundingRects(component);

export interface TooltipRendererProps extends RenderedWithTooltipProps {
  tooltipStyles: {
    content: React.CSSProperties;
    wrapper: React.CSSProperties;
  };
  tooltipContent(tooltipData: ToolTipData): React.ReactElement;
}
/**
 * Wrapper component for default tooltip
 */
export const defaultTooltipRenderer = ({
  tooltipData,
  tooltipContent,
  color,
  x,
  tooltipStyles,
}: TooltipRendererProps) => (
  <BoundedTooltip left={x} style={tooltipStyles.wrapper}>
    <TooltipWrapper style={tooltipStyles.content} color={color as string}>
      {tooltipContent({ tooltipData })}
    </TooltipWrapper>
  </BoundedTooltip>
);

/**
 * Default tooltip content function
 */
export const defaultTooltipContent = ({
  tooltipData,
}: {
  tooltipData: ToolTipData;
}) =>
  Object.entries(tooltipData || {}).map((entry, i) => (
    <p key={`tooltip-content-${entry[0]}-${i}`}>{`${entry[0]}: ${entry[1]}`}</p>
  ));

export function Indicator({
  yCoords,
  x,
  stroke,
  color,
}: RenderedWithTooltipProps) {
  return (
    <>
      <Line
        from={{ x: x, y: 0 }}
        to={{ x: x, y: Math.max(...(yCoords || [])) }}
        stroke={stroke as string}
        strokeWidth={1}
        strokeOpacity={0.5}
        style={{ pointerEvents: 'none' }}
      />
      {(yCoords || []).map((coord: number, i: number) => (
        <circle
          key={`${coord}-${i}`}
          cx={x}
          cy={coord}
          fill="rgb(28, 42, 44)"
          stroke={color as string}
          strokeWidth={1}
          style={{ pointerEvents: 'none' }}
          fillOpacity={1}
          r={4}
        />
      ))}
    </>
  );
}
