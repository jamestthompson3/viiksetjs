import * as React from 'react';

import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { Size, Margin } from '@viiksetjs/utils';

import timeSeries from './data/timeSeries.json';
import biaxialSeries from './data/biaxialSeries.json';

import ChartArea from '../ChartArea';
import LineChart, { LineChart as Component } from '../LineChart';
import YAxis from '../YAxis';
import { BiaxialTooltip, GraphContainer } from './styledComponents';
import { GenericData } from 'typedef';

export default {
  title: 'LineChart',
  component: Component,
};

export const TimeSeries = () => {
  const tooltipContent = ({ tooltipData }: { tooltipData: GenericData }) => (
    <>
      <p>
        messages:{' '}
        <span style={{ color: '#00adee' }}>{tooltipData.messages}</span>
      </p>
      <p>
        time:{' '}
        <span style={{ color: '#00adee' }}>
          {format(parse(tooltipData.time), 'MMM Do HH:mm')}
        </span>
      </p>
    </>
  );

  return (
    <GraphContainer>
      <ChartArea
        data={timeSeries.data}
        axes={{
          x: {
            numTicks: 4,
          },
        }}
        yKey="messages"
        xKey="time"
        type="time"
        color="#2189C8"
        stroke="grey"
        tooltip={{
          content: tooltipContent,
        }}
      >
        <LineChart
          nopattern
          dataKey="messages"
          color={['#2189C8', '#00adee']}
        />
      </ChartArea>
    </GraphContainer>
  );
};

export const BiaxialSeries = () => (
  <GraphContainer>
    <ChartArea
      data={biaxialSeries.data}
      color="rgb(238, 66, 244)"
      stroke="rgba(109, 109, 109, 0.25)"
      tooltip={{
        renderer: BiaxialTooltip,
      }}
      axes={{
        x: {
          numTicks: 4,
        },
      }}
      determineViewBox={({ size, margin }: { size: Size; margin: Margin }) =>
        `-10 0 ${size.width + margin.left + margin.right} ${size.height}`
      }
    >
      <LineChart
        color="rgb(238, 66, 244)"
        gradientOpacity={[0, 0.25]}
        dataKey="users"
        axisId="users"
      />
      <LineChart
        color="rgb(244, 196, 65)"
        gradientOpacity={[0, 0.25]}
        dataKey="posts"
        axisId="posts"
      />
      <YAxis
        color="rgb(244, 196, 65)"
        axisId="posts"
        position="right"
        label="posts"
        tickFormat={(d: number) => d / 1000 + 'k'}
        tickLabelProps={() => ({
          dx: 8,
          fontSize: '12px',
          textAnchor: 'middle',
        })}
        labelProps={{
          y: -20,
          dx: 10,
          textAnchor: 'start',
          fill: 'rgb(244, 196, 65)',
          fontSize: '12px',
        }}
      />
      <YAxis
        color="rgb(238, 66, 244)"
        axisId="users"
        position="left"
        label="users"
        tickFormat={(d: number) => d / 1000 + 'k'}
        labelProps={{
          y: -20,
          dx: -12,
          textAnchor: 'end',
          fill: 'rgb(238, 66, 244)',
          fontSize: '12px',
        }}
      />
    </ChartArea>
  </GraphContainer>
);
