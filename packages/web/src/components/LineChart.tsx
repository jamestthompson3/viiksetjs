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
import { determineYScale } from '@viiksetjs/utils';
import { RenderedChildProps, GenericData } from '../typedef';

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
  type,
  areaProps,
  lineProps,
  gradientOpacity,
}) => {
  const dataPoints = data.map((item: GenericData) => get(item, dataKey));
  React.useEffect(() => {
    // eslint-disable-next-line
    if (process.env.NODE_ENV !== 'production') {
      if (dataPoints.includes(undefined)) {
        console.warn(`LineChart: No data found with dataKey ${dataKey}`);
      }
    }
  }, []);

  const getAxis = () => (!axisId ? inheritedScale : yScale);
  const yScale = determineYScale({
    type: type || 'linear',
    yPoints: dataPoints,
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
};

interface Props extends RenderedChildProps {
  areaProps: Object;
  lineProps: Object;
  gradientOpacity: number[];
  nofill: boolean;
  nopattern: boolean;
}

export default React.memo(LineChart);
