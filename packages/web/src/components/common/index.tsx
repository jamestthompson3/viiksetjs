import * as React from 'react';
import merge from 'lodash/merge';

import {
  StyledLeftAxis,
  StyledBottomAxis,
  StyledGridRows,
} from '../styledComponents';

import {
  determineYScale,
  Axis,
  AxisProps,
  Margin,
  InheritedChartProps,
  ScaleFunction,
} from '@viiksetjs/utils';

interface GridRendererProps {
  yScale: ScaleFunction;
  width: number;
  left: number;
}

export interface LeftAxisRendererProps {
  type?: string;
  orientation?: string;
  height: number;
  yPoints?: number[] | string[];
  margin: Margin;
}

export interface BottomAxisRendererProps {
  margin: Margin;
  height: number;
  scale: ScaleFunction;
}

export const ChildContext = React.createContext<InheritedChartProps>({});

/**
 * Takes React Children and returns true or false if unique axis Id is found
 */
export const biaxial = (children: React.ReactNode): boolean =>
  React.Children.map(
    children,
    child =>
      React.isValidElement(child) &&
      Object.prototype.hasOwnProperty.call(child.props, 'axisId')
  ).includes(true);

export const buildLeftAxis = ({
  y,
  color,
}: {
  y: Partial<AxisProps>;
  color: string;
}): React.FunctionComponent<LeftAxisRendererProps> =>
  React.memo(function LeftAxis({ type, orientation, yPoints, height, margin }) {
    const {
      label,
      numTicks,
      tickLabelProps,
      tickFormat,
      labelProps,
      ...rest
    } = y;
    const scale = determineYScale({
      type,
      orientation,
      yPoints,
      height,
      margin,
    });
    return (
      <StyledLeftAxis
        scale={scale}
        {...{
          color,
          numTicks,
          tickLabelProps,
          tickFormat,
          label,
          labelProps,
          ...rest,
        }}
      />
    );
  });

export const buildBottomAxis = ({
  x,
  color,
}: {
  x: Partial<AxisProps>;
  color: string;
}): React.FunctionComponent<BottomAxisRendererProps> =>
  React.memo(function BottomAxis({ height, margin, scale }) {
    const {
      label,
      numTicks,
      tickLabelProps,
      tickFormat,
      labelProps,
      ...rest
    } = x;
    return (
      <StyledBottomAxis
        {...{
          color,
          height,
          scale,
          margin,
          numTicks,
          tickLabelProps,
          tickFormat,
          label,
          labelProps,
          ...rest,
        }}
      />
    );
  });

export function buildAxis(
  biaxialChildren: boolean,
  position: string,
  defaultAxes: Axis,
  axes: Axis,
  color: string
):
  | React.FunctionComponent<LeftAxisRendererProps>
  | React.FunctionComponent<BottomAxisRendererProps>
  | null {
  const { y, x } = merge({}, defaultAxes, axes);

  if (position === 'left' && !biaxialChildren && axes.y !== null) {
    return buildLeftAxis({ y, color });
  }

  if (position === 'bottom' && axes.x !== null) {
    return buildBottomAxis({ x, color });
  }

  return () => null;
}

export const buildGrid = (
  gridStroke: string,
  noGrid: boolean
): React.FunctionComponent<GridRendererProps> => {
  if (noGrid) return () => null;
  return React.memo(function Grid({
    yScale,
    width,
    left,
  }: {
    yScale: ScaleFunction;
    width: number;
    left: number;
  }) {
    return (
      <StyledGridRows scale={yScale} stroke={gridStroke} width={width - left} />
    );
  });
};
