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
  dataPoints,
  axisId,
  type,
  areaProps,
  lineProps,
  gradientOpacity,
}) => {
  if (!dataKey) throw new Error('LineChart: no data key given');
  const yData = dataPoints[dataKey];
  // React.useEffect(() => {
  //   // eslint-disable-next-line
  //   if (process.env.NODE_ENV !== 'production') {
  //     if (dataPoints.includes(undefined)) {
  //       console.warn(`LineChart: No data found with dataKey ${dataKey}`);
  //     }
  //   }
  // }, []);

  const getAxis = () => (!axisId ? inheritedScale : yScale);
  const yScale = determineYScale({
    type: type || 'linear',
    yPoints: yData,
    height,
    margin,
  });
  const xPoints = (d: GenericData) =>
    xScale(xKey ? get(d, xKey) : extractX(d)[0]);
  const yPoints = (d: GenericData) => getAxis()(get(d, dataKey));
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
        y={yPoints}
        x={xPoints}
        curve={curveMonotoneX}
        {...lineProps}
      />
      {!nofill && (
        <StyledAreaClosed
          {...{ data, color }}
          y={yPoints}
          x={xPoints}
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
            y={yPoints}
            yScale={getAxis()}
            fill={findFill(false)}
            x={xPoints}
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
  dataPoints: GenericData;
  gradientOpacity: number[];
  nofill: boolean;
  nopattern: boolean;
}

type Props = Readonly<InheritedChartProps> & Partial<LineChartProps>;

export default React.memo(LineChart);
