# viiksetjs

<img src="./viiksetjs.jpg" />

A lightweight Javascript graphing library for React based on styled-components and vx

| [BarChart](https://github.com/jamestthompson3/viiksetjs#barchart)
| [ChartArea](https://github.com/jamestthompson3/viiksetjs#chartarea)
| [DataContext](https://github.com/jamestthompson3/viiksetjs#datacontext)
| [LineChart](https://github.com/jamestthompson3/viiksetjs#linechart)
| [PieChart](https://github.com/jamestthompson3/viiksetjs#piechart)
| [ScatterPlot](https://github.com/jamestthompson3/viiksetjs#scatterplot) |

| [StackedBar](https://github.com/jamestthompson3/viiksetjs#stackedbar)
| [StreamableChart](https://github.com/jamestthompson3/viiksetjs#streamablechart)
| [StyledLine](https://github.com/jamestthompson3/viiksetjs#styledline)
| [StyledPoint](https://github.com/jamestthompson3/viiksetjs#styledpoint)
| [Threshold](https://github.com/jamestthompson3/viiksetjs#threshold)
| [Tooltips](https://github.com/jamestthompson3/viiksetjs#tooltips)
| [YAxis](https://github.com/jamestthompson3/viiksetjs#yaxis) |

## About

Viikset is the halfway point between visualization libraries with atomic control like d3 and out of the box solutions
like recharts or chartjs. Big shout out to Harrison Shoff [@hshoff](https://github.com/hshoff) and the people over at
[vx](https://github.com/hshoff/vx) who helped shape the thinking for this type of visualization library.

It is meant to serve both those who want a high level of control (see the 'Interop with vx' section) and those who want
to throw together charts quickly with little to no configuration. If you like this library and want to have more
granular control over your chart components, I would strongly suggest checking out the [vx](https://github.com/hshoff/vx)
repo and familiarizing yourself with it, as any vx components can be used in tandem with Viikset.

### Getting started

`npm install viiksetjs`

To build the examples folder, run `yarn buildExamples` and open then `examples/index.html` file in your browser

### BREAKING in `v0.0.3` new `ChartArea` API

```js
<ChartArea
  axes={{
    x: {
      label: "Time",
      tickLabelProps: (v, i) => ({
          ...stuff
        }),
      numTicks: 4
    }

  }}
  tooltip={{
    styles: {
      wrapper: { display: 'flex' },
    },
    content: TooltipContent
    }}
  >
  <LineChart />
</ChartArea>
```

### Interop with vx

Since Viikset is built on top of vx, you can use any vx components with any Viikset components.
The `ChartArea` component will supply your custom vx components with the following props:

`xScale, yScale (as inheritedScale), data, margin, height, width, type, xKey, yKey, formatY, formatX, numYTicks`
as well as the `mouseMove` and `mouseLeave` functions for tooltips.

### Use with styled-components

In order to use Viikset with the styled-components, you need to have your components wrapped in a [theme provider](https://www.styled-components.com/docs/advanced#theming).
This will give your chart components access to the theming api and allow to pass your predefined theme colors to your charts.

### Data structure

#### The components are built to take an array of data objects:

```json
"chartData":[
  {"day":"2017-11-14","northAmerica":84,"southAmerica":254},{"day":"2017-11-15","northAmerica":103,"southAmerica":393},
  {"day":"2017-11-16","northAmerica":130,"southAmerica":375},{"day":"2017-11-17","northAmerica":142,"southAmerica":495},
  {"day":"2017-11-18","northAmerica":148,"southAmerica":631},{"day":"2017-11-19","northAmerica":141,"southAmerica":628},
  {"day":"2017-11-20","northAmerica":157,"southAmerica":445},{"day":"2017-11-21","northAmerica":168,"southAmerica":407},
  {"day":"2017-11-22","northAmerica":100,"southAmerica":351},{"day":"2017-11-23","northAmerica":135,"southAmerica":382},
  ...
  ]
```

Viikset will detect the x and y values for you however, if you choose to work with data like x and y coordinates,
you must specify your x-values through the `xKey` prop. This is discussed more at length in the `ChartArea` component.

## ChartArea

```js
<ChartArea data={chartData} color="#235789" stroke="#235789">
</ChartArea>
```

The `ChartArea` component will construct a grid and axes on which it will render its children.
It detects the x-values by looking at each data object selecting categorical data types.
However, if you wish to plot data that is not categorical, you must pass the `xKey` prop:

`<ChartData data={dataArray} xKey='xvalues'>`

`ChartArea` takes the size of the its parent component and is responsive by default.

### Props

| Prop            | Default                                                                                                                 | Type                                         | Desc                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :----------     | :---------------------------------------------------------------------------------------------------------------------  | :---------------------------------           | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| color           | #000                                                                                                                    | String                                       | color applied to the axes                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| axes            | \*see section below                                                                                                     | Object                                       | An object with properties `x` and `y` whose own properties are applied to the `x` and `y` axes respectively                                                                                                                                                                                                                                                                                                                                                                        |
| tooltip         | \*see section below                                                                                                     | Object                                       | An object with properties `renderer`, `content`, `indicator`, and `styles` whose own properties are applied to the tooltip                                                                                                                                                                                                                                                                                                                                                                      |
| data            | [ ]                                                                                                                     | Array                                        | An array containing data objects.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| determineViewBox| `-10 0 ${size.width} ${height}`                                                                                                                        | Function                                     | A function for determining the SVG viewBox for the chart area, passed `size` and `margin` as arguments                                                                                                                                                                                                                                                                                                                                                                             |
| gridStroke      | #000                                                                                                                    | String                                       | color applied to the gridlines                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| glyphRenderer   |  -                                                                                                                      | Function                                     | A function that recieves `width`, `height`, `xScale`, `yScale`, and `margin` from the `ChartArea` and renders a glyph or series of glyphs with a `z-index` above all chart elements.                                                                                                                                                                                                                                                                                               |
| margin          | `{ top: 18, right: 15, bottom: 0, left: 30 }`                                                                           | Object                                       | Margin object for chart area                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| noGrid          | false                                                                                                                   | Boolean                                      | If `true`, then no gridlines will be shown on `ChartArea`                                                                                                                                                                                                                                                                                                                                                                                                                          |
| notool          | false                                                                                                                   | Boolean                                      | If `true` then no tooltip will be shown                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| orientation     | ''                                                                                                                      | String                                       | A string indicating the orientation the chart should have, defaults to timeseries                                                                                                                                                                                                                                                                                                                                                                                                  |
| position        | ''                                                                                                                      | String                                       | String for specifying the position of the `ChartArea`. Defaults to 'static'                                                                                                                                                                                                                                                                                                                                                                                                        |
| stroke          | #000                                                                                                                    | String                                       | color applied to the gridlines and to the default indicator line if `gridStroke` is not passed, this prop only applies to the indicator                                                                                                                                                                                                                                                                                                                                            |
| type            | ''                                                                                                                      | `oneOf(['ordinal', 'linear', 'horizontal'])` | A string indicating the type of scale the type should have, defaults to timeseries                                                                                                                                                                                                                                                                                                                                                                                                 |
| xKey            | ''                                                                                                                      | String                                       | Optional key delimiting the xValues, supports nested keys such as `'data.users'`                                                                                                                                                                                                                                                                                                                                                                                                   |

### Axis Props
#### Default axes object passed to `ChartArea`:
```js
  {
  x: {
    tickLabelProps: () => ({
      fontWeight: 400,
      strokeWidth: '0.5px',
      textAnchor: 'start',
      fontSize: 12
    }),
    numTicks: 6,
    label: '',
    stroke: '#000',
    tickStroke: 'transparent',
    labelProps: { fontSize: 12, textAnchor: 'middle', fill: 'black', dy: -10 },
    tickFormat: formatXTicks
  },
  y: {
    tickLabelProps: () => ({
      strokeWidth: '0.5px',
      fontWeight: 400,
      textAnchor: 'end',
      fontSize: 12
    }),
    numTicks: 4,
    label: '',
    stroke: '#000',
    tickStroke: 'transparent',
    tickFormat: formatTicks,
    labelProps: { fontSize: 12, textAnchor: 'middle', fill: 'black' }
  }
}

```
The following are common props for both `x` and `y` axes

| Prop            | Default                                                                                                                 | Type                                         | Desc                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :-------------- | :---------------------------------------------------------------------------------------------------------------------  | :---------------------------------           | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| format          | \*see example below                                                                                                     | Function                                     | A function for formatting the axis passed the argument `d` which represents the data point                                                                                                                                                                                                                                                                                                                                                                                         |
| label           | ''                                                                                                                      | String                                       | Label for the axis                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| labelProps      | `{ fontSize: 12, textAnchor: 'middle', fill: 'black' }`                                                                 | Object                                       | Props for label                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| numTicks        | 6                                                                                                                       | Integer                                      | Number of ticks for the axis                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| tickLabelProps  | `() => ({ dy: '-0.25em', fontWeight: '400', strokeWidth: '0.5px', textAnchor: 'left', fontSize: 12})`                  | Function                                     | Function that returns the labelProps for the axis                                                                                                                                                                                                                                                                                                                                                                                                                                  |

### Toolip Props


| Prop            | Default                                                                                                                 | Type                                         | Desc                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :-------------- | :---------------------------------------------------------------------------------------------------------------------  | :---------------------------------           | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| indicator       | \*see tooltip section below for examples                                                                                | Function                                     | React component that gets passed the following props: `yCoords, x, stroke, color, height`. `yCoords` are the calculated yCoordinates for all datapoints in the chart at the given mouse position. is the x coordinate of the closest estimated data point to the current mouse position.`mouseX` is the current position of the mouse. `height` is the height of the `ChartArea`. `stroke` and `color` are inherited from `ChartArea`.                                             |
| content         | \*see tooltip section below for examples                                                                                | Function                                     | A function that return a React Component which renders the content of the tooltip. Gets passed the following props: `tooltipData`, `color` where color is inherited from the `ChartArea` component                                                                                                                                                                                                                                                                                 |
| renderer        | \*see tooltip section below for examples                                                                                | Function                                     | A function that returns a React Component that gets passed the following props: `tooltipData, color, x, mouseX, yCoords`. `tooltipData` contains the calculated data object for current mouse position. `color` is the color passed from `ChartArea`. `x` is the x coordinate of the closest estimated data point to the current mouse position. `mouseX` is the current position of the mouse. `yCoords` is the calculated yCoordinates for the data point at mouse position `x`. |
| styles          | {}                                                                                                                      | Object                                       | An object containing two React style objects, `wrapper` and `content`. `{wrapper: { position: 'absolute'}, content: { color: 'yellow'}}` for quick styling without having to write a complete custom tooltip                                                                                                                                                                                                                                                                       |

## DataContext
The `DataContext` component allows even greater flexibility for working with your data. It takes a set of props needed to create scales,
and returns these scale values to you which can be used with svg, d3, canvas, or even DOM nodes.

### Props

| Prop            | Defaults                                      | Type                                          | Desc                                                                                          |
| :-------------- | :-------------------------------------------- | :---------------------------------------------| :-------------------------------------------------------------------------------------------- |
| data            | []                                            |  Array                                        | Array of chart data                                                                           |
| margin          | `{ top: 18, right: 15, bottom: 0, left: 30 }` | Object                                        | An optional object delineating margin values                                                  |
| orientation     | ''                                            | String                                        | An optional string denoting the orientation of the `DataContext`                              |
| type            | ''                                            | `oneOf(['ordinal', 'linear', 'horizontal'])`  | An optional string indicating the type of scale the type should have, defaults to timeseries  |
| xKey            |  null                                         | String                                        | An optional string denoting the data key for x values, supports nesting such as `'some.thing'`|
| yKey            |  null                                         | String                                        | An optional string denoting the data key for y values, supports nesting such as `'some.thing'`|

```js
<DataContext data={chartdata} margin={margin}>
{
  ({
    xScale,
     size,
     dataKeys,
     biaxialChildren,
     data,
     width,
     height,
     yPoints,
     xPoints,
     yScale,
     yScales
  }) => {/* render children here */}
}
</DataContext>
```

## StreamableChart
The `StreamableChart` component takes a `connection` string which is a URL for a WebSocket.
The chart will then begin streaming the data from the connection.

```js
 <StreamableChart
    connection="ws://wiki-update-sockets.herokuapp.com/"
    streamParser={streamParser}
    mapStream={streamMap}
  >
  </StreamableChart
```

### Props
| Prop           | Default                                                                | Type                               | Desc                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| :----------    | :------------------------------------------------------                | :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| connection     | ''                                                                     | string                             | WebSocket url                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| color          | #000                                                                   | String                             | color applied to the axes                                                                                                                                                                                                                                                                                                                                                                                                                                |
| axes           | \*see section above                                                    | Object                             | An object with properties `x` and `y` whose own properties are applied to the `x` and `y` axes respectively                                                                                                                                                                                                                                                                                                                                                                        |
| loadingMessage | `<h2>Loading data..</h2>`                                              | React Element                      | A component to be rendered while the WebSocket connection is being established and waiting for data                                                                                                                                                                                                                                                                                                                                                      |
| mapStream      | `(data, message) => [...data, message]`                                | function                           | A function for manipulating the accumulating data array, recieves the data array and the next message being pushed to the array as arguments                                                                                                                                                                                                                                                                                                             |
| margin         | `{ top: 18, right: 15, bottom: 0, left: 30 }`                          | Object                             | Margin object for chart area                                                                                                                                                                                                                                                                                                                                                                                                                             |
| nogrid         | false                                                                  | Boolean                            | If `true`, then no gridlines will be shown on the `StreamableChart`                                                                                                                                                                                                                                                                                                                                                                                      |
| orientation    | ''                                                                     | String                             | A string indicating the orientation the chart should have, defaults to timeseries                                                                                                                                                                                                                                                                                                                                                                        |
| persist        | 2500                                                                   | number                             | If the data array reaches this limit, values will be popped from the beginning  of the array                                                                                                                                                                                                                                                                                                                                                             |
| position       | ''                                                                     | String                             | String for specifying the position of the `StreamableChart`. Defaults to 'static'                                                                                                                                                                                                                                                                                                                                                                        |
| stopPersist    |                                                                        | number                             | If the data array reaches this limit, the connection will close                                                                                                                                                                                                                                                                                                                                                                                          |
| streamParser   | `message => message`                                                   | function                           | A function for parsing the `message` argument passed by the `onmessage` event from the socket connection                                                                                                                                                                                                                                                                                                                                                 |
| stroke         | #000                                                                   | String                             | color applied to the gridlines                                                                                                                                                                                                                                                                                                                                                                                                                           |
| type           | ''                                                                     | `oneOf(['ordinal', 'linear', ''])` | A string indicating the type of scale the type should have, defaults to timeseries                                                                                                                                                                                                                                                                                                                                                                       |
| xKey           | ''                                                                     | String                             | Optional key delimiting the xValues supports nested keys such as `'data.users'`                                                                                                                                                                                                                                                                                                                                                                          |
| viewBox        | `-10 0 ${size.width} ${height}`                                        | String                             | SVG viewBox for the chart area                                                                                                                                                                                                                                                                                                                                                                                                                           |

#### Default Format Functions

format y axis

```js
d => (d >= 1000 ? `${d / 1000}k` : d)
```

format x axis

```js
d => {
  if (checkDate(d)) {
    return formatTime(d)
  } else {
    return d
  }
}
```

## LineChart

The `LineChart` component inherits the data from the `ChartArea` which wraps it. Using this data, it scales itself accordingly.
A `dataKey` prop must be provided in order for the component to know which data points it should render.

### Props

| Prop            | Default | Type    | Desc                                                                                          |
| :-------------- | :-----: | :------ | :-------------------------------------------------------------------------------------------- |
| axisId          | ''      | String  | String denoting which axis the LineChart belongs to, needed only when creating biaxial charts |
| areaProps       | {}      | Object  | vx props applied to the area fill                                                             |
| color           | #000    | String  | Color string. Supports colors from styled-components' `themeProvider`.                        |
| dataKey         | ''      | String  | Key for data to be graphed, supports nested keys such as `'data.users'`                       |
| gradientOpacity |         | Array   | Array of of two values between 0 and 1 to be applied to the LineChart gradient                |
| lineProps       | {}      | Object  | vx props applied to the line path                                                             |
| nofill          | false   | Boolean | If `true`, the LineChart will have no fill                                                    |
| nopattern       | false   | Boolean | If `true`, the LineChart will have no pattern                                                 |

```js
<LineChart dataKey="count_messages" color="rgb(0, 157, 253)" />
```

There can be multiple `LineChart` components within a single `ChartArea`:

```js
const data = [
  {"day":"2017-11-14","northAmerica":84,"southAmerica":254, "asia": 122, "europe": 23},
  {"day":"2017-11-15","northAmerica":103,"southAmerica":393, "asia": 55 , "europe": 455},
  {"day":"2017-11-16","northAmerica":130,"southAmerica":375, "asia": 344, "europe": 54},
  {"day":"2017-11-17","northAmerica":142,"southAmerica":495, "asia": 100, "europe": 455},
  {"day":"2017-11-18","northAmerica":148,"southAmerica":631, "asia": 322, "europe": 87},
  {"day":"2017-11-19","northAmerica":141,"southAmerica":628, "asia": 445, "europe": 277},
  {"day":"2017-11-20","northAmerica":157,"southAmerica":445, "asia": 65, "europe": 213},
  {"day":"2017-11-21","northAmerica":168,"southAmerica":407, "asia": 55, "europe": 56},
  {"day":"2017-11-22","northAmerica":100,"southAmerica":351, "asia": 43, "europe": 76},
  {"day":"2017-11-23","northAmerica":135,"southAmerica":382, "asia": 455, "europe": 76},
  ...
  ]
    <ChartArea
      data={data}
      color="rgb(0, 172, 227)"
      stroke="rgba(109, 109, 109, 0.13)"
      tooltip={{ content: TooltipComponent }}
    >
      <LineChart color="rgb(0, 172, 227)" dataKey="northAmerica" />
      <LineChart color="rgb(188,83,83)" dataKey="southAmerica" />
      <LineChart color="rgb(196,120,62)" dataKey="asia" />
      <LineChart color="rgb(23, 231, 148)" dataKey="europe" />
    </ChartArea>
```

## BarChart

The `BarChart` component inherits the data from the `ChartArea` which wraps it. Using this data, it scales itself accordingly.
When creating a categorical `BarChart` component, it is necessary to pass `type='ordinal'` to the parent `ChartArea`.
A `dataKey` prop must be provided in order for the component to know which data points it should render.
Passing an `xKey` prop to the `ChartArea` component is also required to denote which values should be graphed across the xValue,
as is passing a `yKey` if there is more than one item in the data object that is an integer or float.


### Props

| Prop     | Default | Type    | Desc                                                                     |
| :------- | :-----: | :------ | :----------------------------------------------------------------------- |
| color    | #000    | String  | Color string. Supports colors from styled-components' `themeProvider`.   |
| dataKey  | ''      | String  | Key for data to be graphed, supports nested keys  such as `'data.users'` |
| inverted | false   | Boolean | If `true`, the BarChart will start from the top and go to the bottom     |
| nofill   | false   | Boolean | If `true`, the BarChart will have no fill                                |

#### data

```json
{
  "company": "Duffy's",
  "beanName": "Rio Dulce, Xoco",
  "cocoaPercentage": 0.7,
  "score": 4,
  "origin": "Guatemala"
}
```

```js
<ChartArea
  data={categoricalSeries.data}
  type="ordinal"
  color="#dc7d5b"
  axes={{
    y: {
      label: "Culinary Score"
    }
  }}
  xKey="company"
  yKey="score"
  stroke="grey"
  nogrid
>
  <BarChart dataKey="score" color="#dc7d5b" />
</ChartArea>
```

## StackedBar

The `StackedBar` component is nearly identical to the `Barchart` in the props that it inherits from the `ChartArea`.
It takes an two additional props, `colors` and `keys` which corresponde to the data you want displayed in the stack.
You may also pass a boolean prop called `horizontal` to flip the `StackedBar` on its side.

### Props

| Prop       | Default | Type    | Desc                                                                                                        |
| :------    | :-----: | :------ | :---------------------------------------------------------------------                                      |
| colors     | []      | Array   | Array of colors that correspond to the given keys. Supports colors from styled-components' `themeProvider`. |
| horizontal | false   | Boolean | If `true`, the StackedBar will be horizontal                                                                |
| keys       | []      | Array   | Keys for data to be graphed                                                                                 |


### data

```json
{
  "data": [
    {"activity": "skiing", "often": 20, "sometimes": 30, "never": 50},
    {"activity": "golfing", "often": 50, "sometimes": 30, "never": 20},
    {"activity": "hiking", "often": 60, "sometimes": 30, "never": 10},
    {"activity": "bicycling", "often": 40, "sometimes": 40, "never": 20}
  ]
}
```

```js
        <ChartArea
          data={stackedData.data}
          type={orientation}
          color="grey"
          xKey="activity"
          stroke="grey"
          axes={{
            y: null
          }}
          nogrid
          yKey='activity'
         >
           <StackedBar
             colors={['#51344D', '#6F5060', '#A78682']}
             keys={['often', 'sometimes', 'never']}
           />
      </ChartArea>
```

## ScatterPlot
The `ScatterPlot` component inherits the data from the `ChartArea` which wraps it. Using this data, it scales itself accordingly.
A `dataKey` prop must be provided in order for the component to know which data points it should render.

### Props

| Prop        | Default | Type                                     | Desc                                                                                                                                      |
| :-----------| :-----: | :--------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| color       | #000    | Enum ( String,  (d: Object) => string )  | Color string or function that takes the current data point and returns a string. Supports colors from styled-components' `themeProvider`. |
| dataKey     | ''      | String                                   | Key for data to be graphed, supports nested keys such as `'data.users'`                                                                   |
| opacity     | 0.8     | Enum ( Number, (d: Object) => string )   | The opacity of the points, is either a number from 0 to 1, or a function that takes the current data point and returns such a number      |
| pointProps  | {}      | Object                                   | Additional props to be applied to each point                                                                                              |
| radius      | 8       | Enum ( Number, (d: Object) => string )   | The radius of the points in the Scatterplot, either a number, or a function that takes the current datapoint and returns a number         |
| stroke      | #000    | String                                   | Color string. Supports colors from styled-components' `themeProvider`.                                                                    |

```js
        <ChartArea
          data={numericSeries.data}
          color="#42f4c2"
          stroke="grey"
          axes={{
            x: {
              label: "Observation No."
            },
            y: {
              label: "Heat (K)"
            }
          }}
          tooltip: {{
            indicator: Indicator
          }}
          xKey="x"
          yKey="y"
          type="linear"
        >
          <ScatterPlot dataKey="y" color="#42f4c2" />
        </ChartArea>
```

## PieChart

The `PieChart` component is independent of the `ChartArea`. It takes it's own data prop and exposes the following props
to `Tooltip` components: `tooltipData`, `height`, `width`, `mouseX`, `mouseY`, `color`

### Props

| Prop             | Default  | Type     | Desc                                                                                                                                                                      |
| :-------         | :-----:  | :------  | :---------------------------------------------------------------------                                                                                                    |
| color            | #000     | String   | Color string. Supports colors from styled-components' `themeProvider`.                                                                                                    |
| data             | []       | Array    | An array of data objects to be visualized                                                                                                                                 |
| dataKey          | ''       | String   | A key for denoting which data should be charted, supports nested keys such as `'data.users'`                                                                              |
| determineOpacity | d => 0.5 | Function | A function that determines the opacity of the pie slices                                                                                                                  |
| innerRadius      | 0        | Number   | The radius of the inner part of the `PieChart`                                                                                                                            |
| labelKey         | ''       | String   | A key for denoting data labels                                                                                                                                            |
| outerRadius      | 0        | Number   | The radius of the outer part of the `PieChart`                                                                                                                            |
| tooltipContent   |          | Function | Function that returns the tooltip content rendered in the `PieChart`                                                                                                      |
| tooltipRenderer  |          | Function | Function that returns the tooltip rendered in the `PieChart` receives the following props: `tooltipData`, `tooltipContent`, `mouseX`, `mouseY`, `height`, `width`,`color` |
| pieProps         |          | Object   | Additional props to be passed to `PieChart`                                                                                                                               |

```js
  <PieChart
    dataKey="score"
    determineOpacity={d => d.score / 5}
    data={categoricalSeries.data}
    color="#5042f4"
    labelKey="company"
    innerRadius={80}
   />
```

## Threshold

A threshold graph that displays the differences between two sets of datapoint

### Props
| Prop           | Default                             | Type    | Desc                                                                              |
| :------        | :---------------------------------: | :------ | :-------------------------------------------------------------------------------- |
| aboveAreaProps | { fill: 'green', fillOpacity: 0.5 } | Object  | Props object for the Area above the threshold cutoff                              |
| belowAreaProps | { fill: 'red, fillOpacity: 0.5 }    | Object  | Props object for the Area below the threshold cutoff                              |
| clipAboveTo    | 0                                   | Number  | Above clip limit                                                                  |
| clipBelowTo    | height                              | Number  | Below clip limit                                                                  |
| y0             | -                                   | String  | Specifies the first threshold data category, can be nested like other data keys   |
| y1             | -                                   | String  | Specifies the second threshold data category, can be nested like other data keys  |

## StyledPoint

A simple point component.

### Props

| Prop    | Default | Type    | Desc                                                                   |
| :------ | :-----: | :------ | :--------------------------------------------------------------------- |
| x       | -       | Number  | x coordinate                                                           |
| y       | -       | Number  | y coordinate                                                           |
| color   | -       | String  | Color string. Supports colors from styled-components' `themeProvider`. |
| opacity | -       | Number  | Opacity for the point                                                  |
| radius  | -       | Number  | Size of point radius                                                   |

## StyledLine

A simple line component.

### Props

| Prop            | Default | Type    | Desc                                                                   |
| :------         | :-----: | :------ | :--------------------------------------------------------------------- |
| color           | -       | String  | Color string. Supports colors from styled-components' `themeProvider`. |
| from            | -       | Object  | Ending point of the line with shape of `{ x: int, y: int}`             |
| strokeDasharray | -       | String  | Pattern of stroke.                                                     |
| to              | -       | Object  | Starting point of the line with shape of `{ x: int, y: int}`           |
| width           | -       | Number  | Width of the line.                                                     |

## YAxis
A YAxis component

### Props
| Prop       | Default                                                                                                                 | Type                       | Desc                                                                        |
| :----      | :------:                                                                                                                | :----                      | :-----                                                                      |
| format     | -                                                                                                                       | Function                   | Function for formatting YAxis                                               |
| labelProps | `{ fontSize: 12, textAnchor: 'middle', fill: 'black' }`                                                                 | Object                     | Props applied to the YAxis label                                            |
| numTicks   | -                                                                                                                       | Number                     | Number of ticks on the axis                                                 |
| position   | right                                                                                                                   | `oneOf(['left', 'right'])` | Positions the YAxis on either the left or the right side of the `ChartArea` |
| tickLabels | ` () => ({ dy: '-0.25rem', dx: '-0.75rem', strokeWidth: '0.5px', fontWeight: '400', textAnchor: 'end', fontSize: 12 })` | Function                   | Function returning the YAxis tick label props                               |

## StyledBar
Styled components implementation of [vx bar](https://github.com/hshoff/vx/blob/master/packages/vx-shape/Readme.md#bar-)

## StyledLinePath
Styled components implementation of [vx line path](https://github.com/hshoff/vx/blob/master/packages/vx-shape/Readme.md#linepath-)

## StyledAreaClosed
Styled componenets implementation of [vx area closed](https://github.com/hshoff/vx/blob/master/packages/vx-shape/Readme.md#areaclosed-)

## Tooltips

Included in Viikset are some tooltip utilties.
By default, Viikset does provide a tooltip component. You need only to return a
React in `content` and it will be rendered within the default component.
However, if you wish to make your own tooltip component, see the
example below on how to use the tooltip API.

When creating a custom tooltip, you must return a component in the
`tooltip.renderer` prop in the `ChartArea` component. This will recieve the following props:

| Prop           | Type     | Desc                                                                                               |
| :------        | :------  | :---------------------------------------------------------------------                             |
| color          | String   | The color prop passed to `ChartArea`                                                               |
| height         | Number   | The height of the svg chart area                                                                   |
| mouseX         | Number   | The svg x coordinate of the current mouse pointer location                                         |
| mouseY         | Number   | The svg y coordinate of the current mouse pointer location                                         |
| tooltipContent | Function | A function which returns a component containing the content of the tooltip                         |
| tooltipData    | Object   | An object containing all of the information in the closest datapoint to the current mouse position |
| yCoords        | Array    | Array of the svg y coordinates of the data being mapped                                            |
| x              | Number   | The svg x coordinate of the closest data point to the mouse pointer location                       |


#### Example

The default tooltip uses this function to move the move the toolitp to the side when it reaches the end of the chart area.
It recieves the
First, construct component to be rendered as a tooltip

```js
const TooltipContainer = styled.div.attrs(p => ({
  style: {
    left: `${p.bounds.left}px`,
    top: `${p.bounds.top}px`
  })
})`
  display: inline-flex;
  position: relative;
  pointer-events: none;
  z-index: 10000;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`
const TooltipWrapper = ({ children, getRects, getRects, left }) => {
  const { rect, parentRect } = getRects()
  const getBounds = () => {
    if (rect && parentRect) {
      return {
        left: boundsSetter({ left, rect, parentRect }),
        top: parentRect.top - rect.height
      }
    }
    return {
      left: left,
      top: 0
    }
  }
  return <TooltipContainer bounds={getBounds()}>{children}</TooltipContainer>
}

```

Next, pass it as the `tooltipRenderer` prop within the `ChartArea` component

```js
<ChartArea
  tooltip={{ renderer: TooltipWrapper }}
  data={chartData}
  color="#235789"
  stroke="#235789"
  >
</ChartArea>
```
