import * as React from 'react';
import {
  scaleLinear,
  scaleTime,
  scaleBand,
  ScaleBand,
  ScaleLinear,
  ScaleTime,
} from 'd3-scale';
import { ScaleProps, Axis, MouseMove, ScaleFunction, Margin } from './typedef';
import head from 'lodash/head';
import get from 'lodash/get';
import last from 'lodash/last';
import sortedUniq from 'lodash/sortedUniq';

interface InheritedChartProps {
  data: { [key: string]: any }[];
  xScale: ScaleFunction<any, any>;
  margin: Margin;
  height: number;
  noTool: boolean;
  axes: Axis;
  yPoints: any[];
  xPoints: any[];
  width: number;
  declareBar(): void;
  type: string;
  orientation: string;
  mouseLeave(): void;
  mouseMove({
    event,
    xPoints,
    xScale,
    yScale,
    yScales,
    dataKeys,
    datum,
  }: Partial<MouseMove>): void;
  xKey: string;
  yKey: string;
  inheritedScale: ScaleFunction<any, any>;
}

interface ChildProps extends InheritedChartProps {
  children: any;
}

/**
 * Recursively clones children, passing props down nested DOM structures
 */
export const recursiveCloneChildren = (
  children: React.ReactNode,
  props: Partial<ChildProps>
): React.ReactNode =>
  React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;

    if (child.props) {
      props['children'] = recursiveCloneChildren(
        child.props['children'],
        props
      );

      return React.cloneElement(child, props);
    }

    return child;
  });

export const determineXScale = ({
  type,
  xPoints,
  width,
  orientation,
  margin,
}: Partial<ScaleProps>): ScaleFunction<any, any> => {
  const range = [get(margin, 'left', 0), width || 0];
  const sortedX = sortedUniq(xPoints as number[]);
  const sortedDomain = [head(sortedX) || 0, last(sortedX) || 0];

  switch (type) {
    case 'ordinal':
      return orientation === 'horizontal'
        ? (scaleLinear()
            .domain([0, Math.max(...(xPoints as number[]))])
            .range(range) as ScaleLinear<number, number>)
        : (scaleBand()
            .domain(xPoints as string[])
            .range([get(margin, 'left', 0), width || 0])
            .padding(0.1) as ScaleBand<React.ReactText>);
    case 'linear':
      return scaleLinear()
        .domain([0, Math.max(...(xPoints as number[]))])
        .range(range) as ScaleLinear<number, number>;
    default:
      return scaleTime()
        .domain(sortedDomain)
        .range(range) as ScaleTime<number, number>;
  }
};

export const determineYScale = ({
  type,
  orientation,
  yPoints,
  height,
  invertedRange,
  margin,
}: Partial<ScaleProps>): ScaleFunction<any, any> => {
  const marginTop = get(margin, 'top', 0) as number;
  const range = [height as number, marginTop];
  const reverseRange = [marginTop, height || 0];
  switch (type) {
    case 'linear':
      return scaleLinear()
        .domain([0, Math.max(...(yPoints as number[]))])
        .range(range) as ScaleLinear<number, number>;
    case 'ordinal':
      return orientation === 'horizontal'
        ? (scaleBand()
            .domain(yPoints as string[])
            .range([height as number, marginTop])
            .padding(0.1) as ScaleBand<React.ReactText>)
        : (scaleLinear()
            .domain([0, Math.max(...(yPoints as number[]))])
            .range(invertedRange ? reverseRange : range) as ScaleLinear<
            number,
            number
          >);
    default:
      return scaleLinear()
        .domain([0, Math.max(...(yPoints as number[]))])
        .range(range) as ScaleLinear<number, number>;
  }
};

/**
 * Finds the xCoordinates within the tooltipCalcuation
 * TODO Support more chart types
 */
export const findTooltipX = ({
  calculatedX,
  xScale,
}: {
  calculatedX: any;
  xScale(num: number): number;
}): number => {
  return xScale(calculatedX);
};

/**
 * Takes React Chilren and returns true or false if unique axis Id is found
 */
export const biaxial = (children: React.ReactNode): boolean =>
  React.Children.map(
    children,
    child => React.isValidElement(child) && child.props.hasOwnProperty('axisId')
  ).includes(true);