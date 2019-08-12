import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import timeSeries from './timeSeries.json';
import { ChartArea, LineChart } from '../src';

interface TestProps {
  label: string;
}
function TestComp({ props }: { props?: Partial<TestProps> }) {
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
        label="cool chart"
        {...props}
      >
        <LineChart dataKey="messages" color="#2189C8" />
      </ChartArea>
    </div>
  );
}

describe('renders ChartArea component successfully', () => {
  it('renders a LineChart', () => {
    const { getByTestId } = render(<TestComp />);

    const chartArea = getByTestId('chart-area');
    expect(chartArea).toBeInTheDocument();
  });
  it('renders the chart with the correct label', () => {
    const { getByText } = render(<TestComp />);
    const chartLabel = getByText(/cool chart/i);
    expect(chartLabel).toBeInTheDocument();
  });
});
