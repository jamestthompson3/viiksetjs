# viiksetjs
<img src="./viiksetjs.jpg" />

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

  <ChartArea data={chartData} color='#235789' stroke='#235789'>
  </ChartArea>
```

The `ChartArea` component will construct a grid and axes on which it will render its children. It detects the x-values by looking at each data object selecting categorical data types. However, if you wish to plot data that is not categorical, you must pass the `xKey` prop:
`<ChartData data={dataArray} xKey='xvalues'>`

`ChartArea` takes the size of the its parent component and is responsive by default.

### Props
| Prop          | Default       | Type | Desc  |
| :------------- |:-------------:| :-----| :----|
| data     | [] | Array | An array containing data objects.
| color     | #000      | String |   color applied to the axes |
| stroke | #000    | String | color applied to the gridlines and to the default indicator line |
|xKey | '' | String | Optional key delimiting the xValues|
|tooltip | found in src styled components| Function | React component that gets passed the following props: `tooltipData, color, x, yCoords`. `tooltipData` contains the calculated data object for current mouse position. `color` is the color passed from `ChartArea`.  `x` is the position of the mouse. `yCoords` is the calculated yCoordinates for the data point at mouse position `x`.|
|indicator | found in src/styledComponents | Function | React component that gets passed the following props: `yCoords, x, stroke, color, height`. `yCoords` are the calculated yCoordinates for all datapoints in the chart at the given mouse position. `x` is the calculated xValue at the given mouse position. `height` is the height of the `ChartArea`.  `stroke` and `color` are inherited from `ChartArea`.|
|nogrid| false | Boolean | If `true`, then no gridlines will be shown on `ChartArea`|
|notool| false | Boolean | If `true` then no tooltip will be shown|
|formatY | *see example below | Function | A function for formatting the yAxis passed the argument `d` which represents the data point|
|formatX | *see example below| Function | A function for formatting the xAxis passed the argument `d` which represents the data point|
| viewBox | String | | SVG viewBox for the chart area|
| margin | `{ top: 18, right: 15, bottom: 0, left: 30 }` | Object | Margin object for chart area|

### Default Format Functions
formatY
```js
d => (d >= 1000 ? `${d / 1000}k` : d)
```
formatX
```js
d => {
  if (d.getTime() != null) {
    return formatTime(d)
  }
  else {
    return d
  }
}
```

## LineChart
`LineChart` component inherits the data from the `ChartArea` which wraps it. Using this data, it scales itself accordingly. A data-key must be provided in order for the component to know which data points it should render.

```js
    <LineChart dataKey='count_bans' color='rgb(0, 157, 253)'/>
```

### Props
| Prop          | Default       | Type | Desc  |
| :------------- |:-------------:| :-----| :----|
| dataKey | '' | String | Key for data to be graphed |
| color     | #000 | String | Color string. Supports colors from styled-components' `themeProvider`.|
| nofill | false | Boolean | If true, the LineChart will have no fill|
| nopattern | false | Boolean | If true, the LineChart will have no pattern |
