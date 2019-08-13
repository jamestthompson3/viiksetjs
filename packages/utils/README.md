# @viiksetjs/utils

This library contains useful functions for manipulating data for data visualizations. It does not necessarily have to be used in conjunction with [@viiksetjs/web](https://github.com/jamestthompson3/viiksetjs/blob/master/packages/web/README.md)

## Exported Functions

| Function Name | Signature                                                    | Desc                                                                                                                                                                                                                                                                                   |
| :------------ | :----------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `parseIfDate` | (data: any): Date \| undefined                               | takes any piece of data and tries to convert it into instance of Date. Returns undefined if the conversion fails                                                                                                                                                                       |
| `parseObject` | <T>(obj: Object, arg: string, applicator: (obj) => any): T[] | takes and object, a `typeof` argument, and an applicator function. It will map through the object's values with the applicator, then filter the results according to the `typeof` argument                                                                                             |
| `getX`        | (data: Object[], xKey?: string): any[]                       | takes an array of data objects and optionally an xKey and returns the xKey points for each object in the data array, or tries to parse a date from each object. Example: `getX([{messages: 123, users: 133}, {messages: 100, users: 33}, 'messages'])` would return: `[123, 100, ...]` |
| `getY`        | (data: Object[], yKey?: string): any[]                       | same as `getX` except it tries to fall back to a number instead of trying to parse a Date. Example: `getY([{messages: 123, date: '11-10-2018'},{messages: 100, date: '08-10-2018'}, ...])` would result in `[123, 100,...]`                                                            |

## Exported Interfaces
