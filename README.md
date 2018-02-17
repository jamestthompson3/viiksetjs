# viiksetjs
A lightweight Javascript graphing library for React based on d3

## About

Viikset is the halfway point between visualization libraries with atomic control like d3 and out of the box solutions like recharts or chartjs. Big shout out to Harrision Shoff [@hshoff](https://github.com/hshoff) and the people over at [vx](https://github.com/hshoff/vx) who helped shape the thinking for this type of visualization library.


### Getting started
`npm install viiksetjs`

## Data structure
#### The components are built to take the data like this:
```json
"chartdata":[
  {"day":"2017-11-14","cats":84,"rabbits":254},{"day":"2017-11-15","cats":103,"rabbits":393},
  {"day":"2017-11-16","cats":130,"rabbits":375},{"day":"2017-11-17","cats":142,"rabbits":495},
  {"day":"2017-11-18","cats":148,"rabbits":631},{"day":"2017-11-19","cats":141,"rabbits":628},
  {"day":"2017-11-20","cats":157,"rabbits":445},{"day":"2017-11-21","cats":168,"rabbits":407},
  {"day":"2017-11-22","cats":100,"rabbits":351},{"day":"2017-11-23","cats":135,"rabbits":382},
  ...
  ]
```

Viikset will detect the x and y values for you, however, if you choose to work with data like x and y coordinates, you must specify your x-values through the `xKey` prop. This is discussed more at length in the `ChartArea` component.

## ChartArea
```js

  <ChartArea data={chartData} color='#235789' stroke='#235789' ref={ref => (svg = ref)}>
  </ChartArea>
```

The `ChartArea` component will construct a grid and axes on which it will render its children. It detects the x-values by looking at each data object selecting categorical data types. However, if you wish to plot data that is not categorical, you must pass the `xKey` prop:
`<ChartData data={dataArray} xKey='xvalues'>`

`ChartArea` takes the size of the its parent component and is responsive by default.


## LineChart
```js
    <LineChart dataKey='count_bans' color='rgb(0, 157, 253)'/>
```

`LineChart` component inherits the data from the `ChartArea` which wraps it. Using this data, it scales itself accordingly. A data-key must be provided in order for the component to know which data points it should render.
