```js
const data = require('../../testData.json');

<div style={{height: '300px', width: '900px', position: 'relative'}}>
  <ChartArea data={data.chartdata}>
    <LineChart dataKey='count_bans' color='rgb(0, 157, 253)'/>
  </ChartArea>
</div>
```

`LineChart` component inherits the data from the `ChartArea` which wraps it. Using this data, it scales itself accordingly. A data-key must be provided in order for the component to know which data points it should render.
