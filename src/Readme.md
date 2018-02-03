#### Viikset is built on the [vx](https://github.com/hshoff/vx) framework. This means you can use vx components directly within the `ChartArea` component and they will work as expected

## Data structure
#### The components are built to take a data structure such as this:
```json
"chartdata":[
  {"day":"2017-11-14","dogs":84,"cats":254},{"day":"2017-11-15","dogs":103,"cats":393},
  {"day":"2017-11-16","dogs":130,"cats":375},{"day":"2017-11-17","dogs":142,"cats":495},
  {"day":"2017-11-18","dogs":148,"cats":631},{"day":"2017-11-19","dogs":141,"cats":628},
  {"day":"2017-11-20","dogs":157,"cats":445},{"day":"2017-11-21","dogs":168,"cats":407},
  {"day":"2017-11-22","dogs":100,"cats":351},{"day":"2017-11-23","dogs":135,"cats":382},
  ...
  ]
```

Viikset will detect the x and y values for you, however, if you choose to work with data like x and y coordinates, you must specify your x-values and y-values through the `xKey` and `yKey` props. This is discussed more at length in the `ChartArea` component.
