# viiksetjs

<img src="./viiksetjs.jpg" />

A lightweight Javascript graphing library for React based on styled-components and vx

[ChartArea](https://github.com/jamestthompson3/viiksetjs#chartarea) | [StreamableChart](https://github.com/jamestthompson3/viiksetjs#streamablechart) | [LineChart](https://github.com/jamestthompson3/viiksetjs#linechart)
| [BarChart](https://github.com/jamestthompson3/viiksetjs#barchart) | [StackedBar](https://github.com/jamestthompson3/viiksetjs#stackedbar) | [ScatterPlot](https://github.com/jamestthompson3/viiksetjs#scatterplot)
| [PieChart](https://github.com/jamestthompson3/viiksetjs#piechart) | [StyledPoint](https://github.com/jamestthompson3/viiksetjs#styledpoint) | [StyledLine](https://github.com/jamestthompson3/viiksetjs#styledline) | [Tooltips](https://github.com/jamestthompson3/viiksetjs#tooltips)

## About

Viikset is the halfway point between visualization libraries with atomic control like d3 and out of the box solutions like recharts or chartjs. Big shout out to Harrision Shoff [@hshoff](https://github.com/hshoff) and the people over at [vx](https://github.com/hshoff/vx) who helped shape the thinking for this type of visualization library.

It is meant to serve both those who want a high level of control (see the 'Interop with vx' section) and those who want throw together charts quickly with little to no configuration. If you like this library and want to have more granular control over your chart components, I would strongly suggest checking out the [vx](https://github.com/hshoff/vx) repo and familiarizing yourself with it, as any vx components can be used in tandem with Viikset.

### Getting started

`npm install viiksetjs`

### Interop with vx

Since Viikset is built on top of vx, you can use any vx components with any Viikset components. The `ChartArea` component will supply your custom vx components with the following props:

`xScale, yScale (as inheritedScale), data, margin, height, width, type, xKey, yKey, formatY, formatX, numYTicks` as well as the `mouseMove` and `mouseLeave` functions for tooltips.

### Use with styled-components

In order to use Viikset with the styled-components, you need to have your components wrapped in a [theme provider](https://www.styled-components.com/docs/advanced#theming). This will give your chart components access to the theming api and allow to pass your predefined theme colors to your charts.

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

Viikset will detect the x and y values for you, however, if you choose to work with data like x and y coordinates, you must specify your x-values through the `xKey` prop. This is discussed more at length in the `ChartArea` component.

## ChartArea

```js
<ChartArea data={chartData} color="#235789" stroke="#235789" >
</ChartArea>
```

The `ChartArea` component will construct a grid and axes on which it will render its children. It detects the x-values by looking at each data object selecting categorical data types. However, if you wish to plot data that is not categorical, you must pass the `xKey` prop:
`<ChartData data={dataArray} xKey='xvalues'>`

`ChartArea` takes the size of the its parent component and is responsive by default.

### Props

| Prop            | Default                                                                                                                 | Type                                         | Desc                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :----------     | :------------------------------------------------------                                                                 | :---------------------------------           | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------                           |
| data            | []                                                                                                                      | Array                                        | An array containing data objects.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| type            | ''                                                                                                                      | `oneOf(['ordinal', 'linear', 'horizontal'])` | A string indicating the type of scale the type should have, defaults to timeseries                                                                                                                                                                                                                                                                                                                                                                                                 |
| color           | #000                                                                                                                    | String                                       | color applied to the axes                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| stroke          | #000                                                                                                                    | String                                       | color applied to the gridlines and to the default indicator line if `gridStroke` is not passed, this prop only applies to the indicator                                                                                                                                                                                                                                                                                                                                            |
| gridStroke      | #000                                                                                                                    | String                                       | color applied to the gridlines                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| xKey            | ''                                                                                                                      | String                                       | Optional key delimiting the xValues                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| tooltipRenderer | \*see tooltip section below for examples                                                                                | Function                                     | A function that returns a React Component that gets passed the following props: `tooltipData, color, x, mouseX, yCoords`. `tooltipData` contains the calculated data object for current mouse position. `color` is the color passed from `ChartArea`. `x` is the x coordinate of the closest estimated data point to the current mouse position. `mouseX` is the current position of the mouse. `yCoords` is the calculated yCoordinates for the data point at mouse position `x`. |
| tooltipContent  | \*see tooltip section below for examples                                                                                | Function                                     | A function that return a React Component which renders the content of the tooltip. Gets passed the following props: `tooltipData`, `color` where color is inherited from the `ChartArea` component                                                                                                                                                                                                                                                                                 |
| indicator       | \*see tooltip section below for examples                                                                                | Function                                     | React component that gets passed the following props: `yCoords, x, stroke, color, height`. `yCoords` are the calculated yCoordinates for all datapoints in the chart at the given mouse position. is the x coordinate of the closest estimated data point to the current mouse position.`mouseX` is the current position of the mouse. `height` is the height of the `ChartArea`. `stroke` and `color` are inherited from `ChartArea`.                                             |
| nogrid          | false                                                                                                                   | Boolean                                      | If `true`, then no gridlines will be shown on `ChartArea`                                                                                                                                                                                                                                                                                                                                                                                                                          |
| notool          | false                                                                                                                   | Boolean                                      | If `true` then no tooltip will be shown                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| noYAxis         | false                                                                                                                   | Boolean                                      | If `true` then no yAxis will be shown                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| labelX          | ''                                                                                                                      | String                                       | Label for xAxis                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| labelY          | ''                                                                                                                      | String                                       | Label for yAxis                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| labelXProps     | `{ fontSize: 12, textAnchor: 'middle', fill: 'black' }`                                                                 | Object                                       | Lablel Props for labelX                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| formatX         | \*see example below                                                                                                     | Function                                     | A function for formatting the xAxis passed the argument `d` which represents the data point                                                                                                                                                                                                                                                                                                                                                                                        |
| labelYProps     | `{ fontSize: 12, textAnchor: 'middle', fill: 'black', dy: '-0.5rem' }`                                                  | Object                                       | Label Props for labelY                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| xTickLabelProps | `xTickLabelProps: () => ({ dy: '-0.25rem', fontWeight: '400', strokeWidth: '0.5px', textAnchor: 'left', fontSize: 12})` | Function                                     | Function that returns the labelProps for the xLabels                                                                                                                                                                                                                                                                                                                                                                                                                               |
| formatY         | \*see example below                                                                                                     | Function                                     | A function for formatting the yAxis passed the argument `d` which represents the data point                                                                                                                                                                                                                                                                                                                                                                                        |
| numXTicks       | 6                                                                                                                       | Integer                                      | Number of ticks for the xAxis                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| numYTicks       | 4                                                                                                                       | Integer                                      | Number of ticks for the yAxis                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| viewBox         | String                                                                                                                  |                                              | SVG viewBox for the chart area                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| margin          | `{ top: 18, right: 15, bottom: 0, left: 30 }`                                                                           | Object                                       | Margin object for chart area                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| position        | ''                                                                                                                      | String                                       | String for specifying the position of the `ChartArea`. Defaults to 'static'                                                                                                                                                                                                                                                                                                                                                                                                        |

## StreamableChart
The `StreamableChart` component takes a `connection` string which is a URL for a WebSocket. The chart will then begin streaming the data from the connection.
```js
 <StreamableChart
    connection="ws://wiki-update-sockets.herokuapp.com/"
    streamParser={streamParser}
    mapStream={streamMap}
  ></StreamableChart>
```

### Props
| Prop         | Default                                                                | Type                               | Desc                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| :----------  | :------------------------------------------------------                | :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| connection   | ''                                                                     | string                             | WebSocket url                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| streamParser | `message => message`                                                   | function                           | A function for parsing the `message` argument passed by the `onmessage` event from the socket connection                                                                                                                                                                                                                                                                                                                                                 |
| mapStream    | `(data, message) => [...data, message]`                                | function                           | A function for manipulating the accumulating data array, recieves the data array and the next message being pushed to the array as arguments                                                                                                                                                                                                                                                                                                             |
| stopPersist  |                                                                        | number                             | If the data array reaches this limit, the connection will close                                                                                                                                                                                                                                                                                                                                                                                          |
| persist      | 2500                                                                   | number                             | If the data array reaches this limit, values will be popped from the beginning  of the array                                                                                                                                                                                                                                                                                                                                                             |
| type         | ''                                                                     | `oneOf(['ordinal', 'linear', ''])` | A string indicating the type of scale the type should have, defaults to timeseries                                                                                                                                                                                                                                                                                                                                                                       |
| color        | #000                                                                   | String                             | color applied to the axes                                                                                                                                                                                                                                                                                                                                                                                                                                |
| stroke       | #000                                                                   | String                             | color applied to the gridlines                                                                                                                                                                                                                                                                                                                                                                                                                           |
| xKey         | ''                                                                     | String                             | Optional key delimiting the xValues                                                                                                                                                                                                                                                                                                                                                                                                                      |
| nogrid       | false                                                                  | Boolean                            | If `true`, then no gridlines will be shown on the `StreamableChart`                                                                                                                                                                                                                                                                                                                                                                                      |
| labelX       | ''                                                                     | String                             | Label for xAxis                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| labelY       | ''                                                                     | String                             | Label for yAxis                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| labelXProps  | `{ fontSize: 12, textAnchor: 'middle', fill: 'black' }`                | Object                             | Lablel Props for labelX                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| labelYProps  | `{ fontSize: 12, textAnchor: 'middle', fill: 'black', dy: '-0.5rem' }` | Object                             | Lablel Props for labelY                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| formatX      | \*see example below                                                    | Function                           | A function for formatting the xAxis passed the argument `d` which represents the data point                                                                                                                                                                                                                                                                                                                                                              |
| formatY      | \*see example below                                                    | Function                           | A function for formatting the yAxis passed the argument `d` which represents the data point                                                                                                                                                                                                                                                                                                                                                              |
| numXTicks    | 6                                                                      | Integer                            | Number of ticks for the xAxis                                                                                                                                                                                                                                                                                                                                                                                                                            |
| numYTicks    | 4                                                                      | Integer                            | Number of ticks for the yAxis                                                                                                                                                                                                                                                                                                                                                                                                                            |
| viewBox      | `-10 0 ${size.width} ${height}`                                        | String                             | SVG viewBox for the chart area                                                                                                                                                                                                                                                                                                                                                                                                                           |
| margin       | `{ top: 18, right: 15, bottom: 0, left: 30 }`                          | Object                             | Margin object for chart area                                                                                                                                                                                                                                                                                                                                                                                                                             |
| position     | ''                                                                     | String                             | String for specifying the position of the `StreamableChart`. Defaults to 'static'                                                                                                                                                                                                                                                                                                                                                                        |

#### Default Format Functions

formatY

```js
d => (d >= 1000 ? `${d / 1000}k` : d)
```

formatX

```js
d => {
  if (typeof d === 'object' && moment(d).isValid()) {
    return formatTime(d)
  } else {
    return d
  }
}

```

## LineChart

The `LineChart` component inherits the data from the `ChartArea` which wraps it. Using this data, it scales itself accordingly. A `dataKey` prop must be provided in order for the component to know which data points it should render.

### Props

| Prop      | Default | Type    | Desc                                                                                          |
| :-------- | :-----: | :------ | :-------------------------------------------------------------------------------------------- |
| dataKey   | ''      | String  | Key for data to be graphed                                                                    |
| axisID    | ''      | String  | String denoting which axis the LineChart belongs to, needed only when creating biaxial charts |
| color     | #000    | String  | Color string. Supports colors from styled-components' `themeProvider`.                        |
| nofill    | false   | Boolean | If `true`, the LineChart will have no fill                                                    |
| nopattern | false   | Boolean | If `true`, the LineChart will have no pattern                                                 |
| lineProps | {}      | Object  | vx props applied to the line path                                                             |
| areaProps | {}      | Object  | vx props applied to the area fill                                                             |

```js
<LineChart dataKey="count_messages" color="rgb(0, 157, 253)" />
```

There can be multiple `LineChart` components within a single `ChartArea`:

```js
const data = [
  {"day":"2017-11-14","northAmerica":84,"southAmerica":254, "asia": 122, "europe": 23},{"day":"2017-11-15","northAmerica":103,"southAmerica":393, "asia": 55 , "europe": 455},
  {"day":"2017-11-16","northAmerica":130,"southAmerica":375, "asia": 344, "europe": 54},{"day":"2017-11-17","northAmerica":142,"southAmerica":495, "asia": 100, "europe": 455},
  {"day":"2017-11-18","northAmerica":148,"southAmerica":631, "asia": 322, "europe": 87},{"day":"2017-11-19","northAmerica":141,"southAmerica":628, "asia": 445, "europe": 277},
  {"day":"2017-11-20","northAmerica":157,"southAmerica":445, "asia": 65, "europe": 213},{"day":"2017-11-21","northAmerica":168,"southAmerica":407, "asia": 55, "europe": 56},
  {"day":"2017-11-22","northAmerica":100,"southAmerica":351, "asia": 43, "europe": 76},{"day":"2017-11-23","northAmerica":135,"southAmerica":382, "asia": 455, "europe": 76},
  ...
  ]
<ChartArea
      data={data}
      color="rgb(0, 172, 227)"
      stroke="rgba(109, 109, 109, 0.13)"
      tooltip={TooltipComponent}
    >
      <LineChart color="rgb(0, 172, 227)" dataKey="northAmerica" />
      <LineChart color="rgb(188,83,83)" dataKey="southAmerica" />
      <LineChart color="rgb(196,120,62)" dataKey="asia" />
      <LineChart color="rgb(23, 231, 148)" dataKey="europe" />
    </ChartArea>
```

## BarChart

The `BarChart` component inherits the data from the `ChartArea` which wraps it. Using this data, it scales itself accordingly. When creating a categorical `BarChart` component, it is necessary to pass `type='ordinal'` to the parent `ChartArea`. A `dataKey` prop must be provided in order for the component to know which data points it should render. Passing an `xKey` prop to the `ChartArea` component is also required to denote which values should be graphed across the xValue, as is passing a `yKey` if there is more than one item in the data object that is an integer or float.


### Props

| Prop    | Default | Type    | Desc                                                                   |
| :------ | :-----: | :------ | :--------------------------------------------------------------------- |
| dataKey | ''      | String  | Key for data to be graphed                                             |
| color   | #000    | String  | Color string. Supports colors from styled-components' `themeProvider`. |
| nofill  | false   | Boolean | If `true`, the BarChart will have no fill                              |

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
  xKey="company"
  yKey="score"
  stroke="grey"
  nogrid
  labelY="Culinary Score"
>
  <BarChart dataKey="score" color="#dc7d5b" />
</ChartArea>
```

## StackedBar

The `StackedBar` component is nearly identical to the `Barchart` in the props that it inherits from the `ChartArea`. It takes an two additional props, `colors` and `keys` which corresponde to the data you want displayed in the stack. You may also pass a boolean prop called `horizontal` to flip the `StackedBar` on its side.

### Props

| Prop       | Default | Type    | Desc                                                                                                        |
| :------    | :-----: | :------ | :---------------------------------------------------------------------                                      |
| keys       | []      | Array   | Keys for data to be graphed                                                                                 |
| colors     | []      | Arra    | Array of colors that correspond to the given keys. Supports colors from styled-components' `themeProvider`. |
| horizontal | false   | Boolean | If `true`, the StackedBar will be horizontal                                                                |


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
          nogrid
          yKey='activity'
          yTickLabelProps={() => ({ dx: '-3rem', fontSize: 10, strokeWidth: '0.5px' })}
          noYaxis='horizontal'
         >
           <StackedBar
             colors={['#51344D', '#6F5060', '#A78682']}
             keys={['often', 'sometimes', 'never']}
           />
      </ChartArea>
```



## ScatterPlot
The `ScatterPlot` component inherits the data from the `ChartArea` which wraps it. Using this data, it scales itself accordingly. A `dataKey` prop must be provided in order for the component to know which data points it should render.

### Props

| Prop    | Default | Type    | Desc                                                                   |
| :------ | :-----: | :------ | :--------------------------------------------------------------------- |
| dataKey | ''      | String  | Key for data to be graphed                                             |
| color   | #000    | String  | Color string. Supports colors from styled-components' `themeProvider`. |
| opacity | 0.8     | Number  | The opacity of the points in the Scatterplot                           |
| radius  | 8       | Number  | The radius of the points in the Scatterplot                            |

```js
<ChartArea
          data={numericSeries.data}
          color="#42f4c2"
          stroke="grey"
          xKey="x"
          yKey="y"
          type="linear"
          labelY="Heat (K)"
          labelX="Observation No."
          tooltip={LinearTooltip}
          indicator={Indicator}
        >
          <ScatterPlot dataKey="y" color="#42f4c2" />
        </ChartArea>
```
## PieChart
The `PieChart` component is independent of the `ChartArea`. It takes it's own
data prop and exposes the following props to `Tooltip` components:
`tooltipData`, `height`, `width`, `mouseX`, `mouseY`, `color`

### Props

| Prop             | Default  | Type     | Desc                                                                                                                                                                      |
| :-------         | :-----:  | :------  | :---------------------------------------------------------------------                                                                                                    |
| data             | []       | Array    | An array of data objects to be visualized                                                                                                                                 |
| color            | #000     | String   | Color string. Supports colors from styled-components' `themeProvider`.                                                                                                    |
| dataKey          | ''       | String   | A key for denoting which data should be charted                                                                                                                           |
| labelKey         | ''       | String   | A key for denoting data labels                                                                                                                                            |
| innerRadius      | 0        | Number   | The radius of the inner part of the `PieChart`                                                                                                                            |
| outerRadius      | 0        | Number   | The radius of the outer part of the `PieChart`                                                                                                                            |
| tooltipRenderer  |          | Function | Function that returns the tooltip rendered in the `PieChart` receives the following props: `tooltipData`, `tooltipContent`, `mouseX`, `mouseY`, `height`, `width`,`color` |
| tooltipContent   |          | Function | Function that returns the tooltip content rendered in the `PieChart`                                                                                                      |
| determineOpacity | d => 0.5 | Function | A function that determines the opacity of the pie slices                                                                                                                  |

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
| Prop           | Default                             | Type    | Desc                                                                   |
| :------        | :-----:                             | :------ | :--------------------------------------------------------------------- |
| y0             | -                                   | String  | Specifies the first threshold data category                            |
| y1             | -                                   | String  | Specifies the second threshold data category                           |
| aboveAreaProps | { fill: 'green', fillOpacity: 0.5 } | Object  | Props object for the Area above the threshold cutoff                   |
| belowAreaProps | { fill: 'red, fillOpacity: 0.5 }    | Object  | Props object for the Area below the threshold cutoff                   |
| clipAboveTo    | 0                                   | Number  | Above clip limit                                                       |
| clipBelowTo    | height                              | Number  | Below clip limit                                                       |

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
| to              | -       | Object  | Starting point of the line with shape of `{ x: int, y: int}`           |
| from            | -       | Object  | Ending point of the line with shape of `{ x: int, y: int}`             |
| color           | -       | String  | Color string. Supports colors from styled-components' `themeProvider`. |
| strokeDasharray | -       | String  | Pattern of stroke.                                                     |
| width           | -       | Number  | Width of the line.                                                     |

## YAxis
A YAxis component

### Props
| Prop       | Default                                                                                                                 | Type                       | Desc                                                                        |
| :----      | :------:                                                                                                                | :----                      | :-----                                                                      |
| position   | right                                                                                                                   | `oneOf(['left', 'right'])` | Positions the YAxis on either the left or the right side of the `ChartArea` |
| numYTicks  | -                                                                                                                       | Number                     | Number of ticks on the axis                                                 |
| formatY    | -                                                                                                                       | Function                   | Function for formatting YAxis                                               |
| tickLabels | ` () => ({ dy: '-0.25rem', dx: '-0.75rem', strokeWidth: '0.5px', fontWeight: '400', textAnchor: 'end', fontSize: 12 })` | Function                   | Function returning the YAxis tick label props                               |
| labelProps | `{ fontSize: 12, textAnchor: 'middle', fill: 'black' }`                                                                 | Object                     | Props applied to the YAxis label                                            |

## StyledBar
Styled components implementation of [vx bar](https://github.com/hshoff/vx/blob/master/packages/vx-shape/Readme.md#bar-)

## StyledLinePath
Styled components implementation of [vx line path](https://github.com/hshoff/vx/blob/master/packages/vx-shape/Readme.md#linepath-)

## StyledAreaClosed
Styled componenets implementation of [vx area closed](https://github.com/hshoff/vx/blob/master/packages/vx-shape/Readme.md#areaclosed-)

## Tooltips

Included in Viikset are some tooltip utilties.
By default, Viikset does provide a tooltip component. You need only to return a
React component from the `tooltipContent` props and it will be rendered within the default
component. However, if you wish to make your own tooltip component, see the
example below on how to use the tooltip API.

When creating a custom tooltip, you must return a component from the
`tooltipRenderer` prop in the `ChartArea` component. The `tooltipRenderer`
recieves the following props:

| Prop           | Type     | Desc                                                                                               |
| :------        | :------  | :---------------------------------------------------------------------                             |
| tooltipData    | Object   | An object containing all of the information in the closest datapoint to the current mouse position |
| tooltipContent | Function | A function which returns a component containing the content of the tooltip                         |
| yCoords        | Array    | Array of the svg y coordinates of the data being mapped                                            |
| color          | String   | The color prop passed to `ChartArea`                                                               |
| x              | Number   | The svg x coordinate of the closest data point to the mouse pointer location                       |
| mouseX         | Number   | The svg x coordinate of the current mouse pointer location                                         |
| mouseY         | Number   | The svg y coordinate of the current mouse pointer location                                         |
| height         | Number   | The height of the svg chart area                                                                   |


#### Example

The default tooltip uses this function to move the move the toolitp to the side when it reaches the end of the chart area.
It recieves the
First, construct component to be rendered as a tooltip
```js
const TooltipContainer = styled.div.attrs({
  style: ({ bounds }) => ({
    left: `${bounds.left}px`,
    top: `${bounds.top}px`
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
  tooltipRender={TooltipWrapper}
  data={chartData}
  color="#235789"
  stroke="#235789"
  >
</ChartArea>

```
