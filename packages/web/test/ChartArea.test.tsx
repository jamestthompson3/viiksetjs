import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import timeSeries from './timeSeries.json';
import { ChartArea, LineChart } from '../src';

function TestComp() {
  return (
    <div data-testid="chart-area" style={{ height: 300, width: 300 }}>
      <ChartArea
        data={timeSeries.data}
        axes={{
          x: {
            numTicks: 4,
          },
        }}
        color="#2189C8"
        stroke="grey"
      >
        <LineChart dataKey="messages" color="#2189C8" />
      </ChartArea>
    </div>
  );
}

describe('renders component successfully', () => {
  it('renders a basic component', () => {
    const { getByTestId } = render(<TestComp />);

    const chartArea = getByTestId('chart-area');
    expect(chartArea).toBeInTheDocument();
  });
});
