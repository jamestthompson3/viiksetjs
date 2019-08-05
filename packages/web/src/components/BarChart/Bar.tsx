import * as React from 'react';
import get from 'lodash/get';
import { Group } from '@vx/group';
import { scaleBand, scaleLinear, scaleTime } from 'd3-scale';
import {
  extractX,
  getY,
  determineYScale,
  determineXScale,
  ScaleFunction,
} from '@viiksetjs/utils';

import { StyledGradient, StyledBar } from '../styledComponents';
import { BarChartProps, GenericData, Scales } from 'typedef';

const BarChart: React.FunctionComponent<Props> = ({
  declareBar,
  type,
  margin,
  height,
  width,
  data,
  xPoints,
  yPoints: inheritedPoints,
  axisId,
  color,
  dataKey,
  xKey,
  noTool,
  mouseMove,
  mouseLeave,
  nofill,
  orientation,
  inverted,
  barProps,
}) => {
  const [scales, setScales] = React.useState<Scales>({
    xScale: null,
    yScale: null,
  });
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (data.map(item => get(item, dataKey)).includes(undefined)) {
        // eslint-disable-next-line
        console.warn(`BarChart: No data found with dataKey ${dataKey}`);
      }
    }
  }, []);
  React.useEffect(() => {
    declareBar();
  }, []);

  React.useEffect(() => {
    const yPoints = getY(data, axisId);
    const scalar = type === 'linear' ? scaleLinear : scaleTime;

    if (orientation === 'horizontal') {
      const xScale = scalar() as ScaleFunction<number, number>;
      xScale.domain([0, Math.max(...yPoints)]).range([margin.left, width]);
      const yScale = scaleBand()
        .domain(yPoints)
        .range([height, margin.top])
        .padding(0.1);

      setScales({ xScale, yScale });
    } else {
      const xScale = determineXScale({
        type: 'ordinal',
        xPoints,
        width,
        margin,
      });
      if (axisId) {
        const yScale = determineYScale({
          type: 'linear',
          yPoints,
          height,
          invertedRange: true,
          margin,
        });
        setScales({ xScale, yScale });
      } else {
        const yScale = scalar() as ScaleFunction<number, number>;
        yScale
          .domain([Math.max(...inheritedPoints), 0])
          .range([height, margin.top]);
        setScales({ xScale, yScale });
      }
    }
  }, [type, orientation]);

  const { xScale, yScale } = scales;
  const xPoint = (d: GenericData) => extractX(d, xKey);
  const barHeight = (d: GenericData) => yScale(get(d, dataKey));
  const isHorizontal = orientation === 'horizontal';
  if (!xScale) {
    return null;
  }
  return (
    <>
      <StyledGradient color={color} id={`gradient${xKey}`} />
      {data.map(d => (
        <Group key={`bar${xPoint(d)}`}>
          <StyledBar
            width={xScale.bandwidth()}
            height={barHeight(d)}
            x={xScale(xPoint(d))}
            key="BarChart"
            y={
              isHorizontal ? barHeight(d) : inverted ? 0 : height - barHeight(d)
            }
            data={d}
            fill={!nofill && `url(#gradient${xKey})`}
            onMouseMove={(event: React.SyntheticEvent) =>
              noTool || mouseMove({ event, datum: d })
            }
            onMouseLeave={() => mouseLeave()}
            {...barProps}
          />
        </Group>
      ))}
    </>
  );
};

BarChart.defaultProps = {
  color: 'rgb(0, 157, 253)',
  nofill: false,
  inverted: false,
};

interface Props extends BarChartProps {
  data: GenericData[];
  dataKey: string;
  inheritedScale: ScaleFunction;
  nofill: boolean;
  axisId: string;
  inverted: boolean;
  color: string;
}

export default React.memo(BarChart);
