import isEmpty from 'lodash/isEmpty';

import { extractLabels, getX, getY } from './dataUtils';
import { determineXScale, determineYScale } from './chartUtils';
import { Margin, ScaleFunction, Size } from './typedef';

const DEFAULT_MARGIN = { top: 18, right: 15, bottom: 15, left: 30 };

export function prepChartData<R, O>({
  size,
  xKey,
  yKey,
  type,
  margin = DEFAULT_MARGIN,
  data,
  orientation,
}: Props) {
  if (isEmpty(data)) {
    // eslint-disable-next-line
    process.env.NODE_ENV !== 'production' &&
      console.warn('Data is empty, cannot calculate chart');
    return {} as State<R, O>;
  }

  const start = performance.now();
  const dataKeys = extractLabels(data[0]);
  const width = size.width - margin.left - margin.right;
  const height =
    size.height === 0 ? 300 : size.height - margin.top - margin.bottom;
  const xPoints = getX(data, xKey, type);
  const yPoints = getY(data, yKey);
  const yScale = determineYScale({
    type,
    yPoints,
    height,
    margin,
    orientation,
  });
  const xScale = determineXScale({ type, width, xPoints, margin });
  const chartData: State<R, O> = {
    width,
    height,
    xPoints,
    xScale,
    yScale,
    yPoints,
    dataKeys,
  };

  const end = performance.now();
  const diff = end - start;

  console.log('perpared chart data in: ', diff);
  return chartData;
}

export interface State<Range, Output> {
  width: number;
  height: number;
  xScale?: ScaleFunction<Range, Output>;
  yScale?: ScaleFunction<Range, Output>;
  yScales?: { [key: string]: ScaleFunction<any, any> } | false;
  biaxialChildren?: boolean;
  dataKeys?: string[];
  yPoints: number[] | string[];
  xPoints: number[] | string[];
}

interface Props {
  data: any[];
  type?: 'ordinal' | 'linear';
  orientation?: 'horizontal';
  children?(props: object): React.ReactNode[];
  xKey?: string;
  yKey?: string;
  size: Size;
  margin: Margin;
}
