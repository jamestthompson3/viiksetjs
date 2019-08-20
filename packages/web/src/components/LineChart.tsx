import * as React from 'react';
import get from 'lodash/get';
import { curveMonotoneX } from '@vx/curve';

import {
  StyledGradient,
  StyledPatternLines,
  StyledLinePath,
  StyledAreaClosed,
} from './styledComponents';
import { extractX } from '@viiksetjs/utils';
import { determineYScale, InheritedChartProps } from '@viiksetjs/utils';
import { GenericData, RenderedChildPassedProps } from '../typedef';

const LineChart: React.FunctionComponent<Props> = ({
  data,
  color,
  dataKey,
  xScale,
  xKey,
  nofill,
  height,
  margin,
  nopattern,
  inheritedScale,
  axisId,
  xPoints,
  type,
  areaProps,
  lineProps,
  gradientOpacity,
}) => {
  if (!dataKey) throw new Error('LineChart: no data key given');
  const yDataStart = performance.now();
  const yData = data.map((item: GenericData) => get(item, dataKey));
  const yDataEnd = performance.now();
  console.log('ypoint getter took: ', yDataEnd - yDataStart);

  const yScaleStart = performance.now();
  const getAxis = () => {
    if (!axisId) {
      return inheritedScale;
    }
    return determineYScale({
      type: type || 'linear',
      yPoints: yData,
      height,
      margin,
    });
  };
  const yScaleEnd = performance.now();
  console.log('yscale took: ', yScaleEnd - yScaleStart);
  const xPointGetter = (d: GenericData, i: number) => {
    if (xKey) {
      return type === 'time' ? xScale(xPoints[i]) : xScale(extractX(d)[0]);
    }
  };
  const yPointGetter = (d: GenericData) => getAxis()(get(d, dataKey));
  const gradientKey =
    typeof dataKey === 'string' ? dataKey.split(' ').join('') : dataKey;
  const findFill = (gradient: boolean) =>
    gradient ? `url(#gradient${gradientKey})` : `url(#dlines${gradientKey})`;
  return (
    <>
      {!nofill && (
        <>
          <StyledGradient
            opacity={gradientOpacity}
            color={color}
            id={`gradient${gradientKey}`}
          />
          <StyledPatternLines color={color} id={`dlines${gradientKey}`} />
        </>
      )}
      <StyledLinePath
        {...{ data, color }}
        y={yPointGetter}
        x={xPointGetter}
        curve={curveMonotoneX}
        {...lineProps}
      />
      {!nofill && (
        <StyledAreaClosed
          {...{ data, color }}
          y={yPointGetter}
          x={xPointGetter}
          fill={findFill(true)}
          yScale={getAxis()}
          curve={curveMonotoneX}
          {...areaProps}
        />
      )}
      {nopattern ||
        (!nofill && (
          <StyledAreaClosed
            {...{ data, color }}
            y={yPointGetter}
            yScale={getAxis()}
            fill={findFill(false)}
            x={xPointGetter}
            curve={curveMonotoneX}
            {...areaProps}
          />
        ))}
    </>
  );
};

LineChart.defaultProps = {
  color: 'rgb(0, 157, 253)',
  nofill: false,
  nopattern: false,
  data: [],
};

interface LineChartProps extends RenderedChildPassedProps {
  areaProps: Object;
  lineProps: Object;
  gradientOpacity: number[];
  nofill: boolean;
  nopattern: boolean;
}

type Props = Readonly<InheritedChartProps> & Partial<LineChartProps>;

export default React.memo(LineChart);
