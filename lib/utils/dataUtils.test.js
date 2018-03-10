'use strict';

var _dataUtils = require('./dataUtils');

var data = _interopRequireWildcard(_dataUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe('Data Utilties', function () {
  describe('manipulate data', function () {
    it('returns the values of the object according to the argument type', function () {
      var result = data.parseObject({ data: 1134, time: '2017-12-27T02:00:00.000+02' }, 'string');
      expect(result).toEqual(['2017-12-27T02:00:00.000+02']);
    });
    it('takes an array of objects and a datakey and returns an array of x-value points', function () {
      expect(data.getX([{ users: 33350.0, servers: 2091.0, time: '2017-11-06T02:00:00.000+02' }, { users: 32974.0, servers: 2085.0, time: '2017-11-06T02:05:00.000+02' }])).toEqual(['2017-11-06T02:00:00.000+02', '2017-11-06T02:05:00.000+02']);
      expect(data.getX([{ x: 223, y: 14 }, { x: 334, y: 233 }, { x: 110, y: 2 }], 'x')).toEqual([223, 334, 110]);
    });
    it('takes an array of objects and returns an array of y-value points', function () {
      expect(data.getY([{ users: 33350.0, servers: 2091.0, time: '2017-11-06T02:00:00.000+02' }, { users: 32974.0, servers: 2085.0, time: '2017-11-06T02:05:00.000+02' }])).toEqual([33350.0, 2091.0, 32974.0, 2085.0]);
      expect(data.getY([{ x: 223, y: 14 }, { x: 334, y: 233 }, { x: 110, y: 2 }], 'y')).toEqual([14, 233, 2]);
    });
    it('takes a data object and extracts all Y values', function () {
      expect(data.extractY({ users: 2231, time: '2017-11-06T02:00:00.000+02' })).toEqual([2231]);
      expect(data.extractY({ x: 2231, y: 14 }, 'y')).toEqual([14]);
    });
    it('takes a data object and extracts all X values', function () {
      expect(data.extractX({ users: 2231, time: '2017-11-06T02:00:00.000+02' })).toEqual(['2017-11-06T02:00:00.000+02']);
      expect(data.extractX({ x: 2231, y: 14 }, 'x')).toEqual([2231]);
    });
    it('takes a data object and extracts all Y labels', function () {
      expect(data.extractLabels({ users: 2231, time: '2017-11-06T02:00:00.000+02' })).toEqual(['users']);
      expect(data.extractLabels({
        users: 2231,
        servers: 2232,
        cats: 3,
        time: '2017-11-06T02:00:00.000+02'
      })).toEqual(['users', 'servers', 'cats']);
    });
  });
});