import * as React from 'react';
import { scaleLinear } from 'd3-scale';
import get from 'lodash/get';
import { StyledLeftAxis, StyledRightAxis } from './styledComponents';
import { GenericData, RenderedChildPassedProps } from 'typedef';

import { InheritedChartProps } from '@viiksetjs/utils';
import { ChildContext } from './common';

const YAxis = ({
  axisId,
  color,
  position,
  label,
  labelProps,
  tickLabels,
  numTicks,
  tickFormat,
  ...rest
}: Props): React.ReactElement => {
  if (!axisId) throw new Error('YAxis: no axisId given');
  const { height, data, width, margin } = React.useContext(ChildContext);

  const dataPoints = data.map((item: GenericData) => get(item, axisId));
  const yScale = scaleLinear()
    .domain([0, Math.max(...dataPoints)])
    .range([height, margin.top]);
  return position === 'left' ? (
    <StyledLeftAxis
      {...{ scale: yScale, label, labelProps, color }}
      left={margin.left}
      numTicks={numTicks}
      hideTicks
      tickFormat={tickFormat}
      tickLabelProps={
        tickLabels
          ? tickLabels
          : () => ({
              dy: '-0.25em',
              dx: '-0.75em',
              strokeWidth: '0.5px',
              fontWeight: '400',
              textAnchor: 'end',
              fontSize: 12,
            })
      }
      {...rest}
    />
  ) : (
    <StyledRightAxis
      {...{ scale: yScale, label, labelProps, color }}
      left={width}
      numTicks={numTicks}
      hideTicks
      tickFormat={tickFormat}
      tickLabelProps={
        tickLabels
          ? tickLabels
          : () => ({
              dy: '-0.25em',
              dx: '0.5em',
              strokeWidth: '0.5px',
              fontWeight: '400',
              textAnchor: 'end',
              fontSize: 12,
            })
      }
      {...rest}
    />
  );
};

interface YAxisProps extends RenderedChildPassedProps {
  position: 'left' | 'right';
  label: string;
  tickFormat(d: any, i: number): string;
  numTicks: number;
  axisId: string;
  tickLabels(
    d: any,
    i: number
  ): {
    fontWeight: number;
    strokeWidth: number | string;
    textAnchor: string;
    fontSize: number | string;
  };
  labelProps: Object;
}

YAxis.defaultProps = {
  labelProps: { fontSize: 12, textAnchor: 'middle', fill: 'black' },
};

type Props = Partial<YAxisProps> & Readonly<InheritedChartProps>;

export default React.memo(YAxis);
