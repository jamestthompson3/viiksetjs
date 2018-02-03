```js
const data = require('../../testData.json');
let svg;
<div style={{  width: '900px', height: '200px', position: 'relative', pointerEvents: 'none' }}>
  <ChartArea data={data.chartdata} color='#235789' stroke='#235789' ref={ref => (svg = ref)}>
  <g />
  </ChartArea>
</div>
```

The `ChartArea` component will construct a grid and axes on which it will render its children. It detects the x-values by looking at each data object selecting categorical data types. However, if you wish to plot data that is not categorical, you must pass the `xKey` prop:
`<ChartData data={dataArray} xKey='xvalues'>`

`ChartArea` takes the size of the its parent component and is responsive by default.
