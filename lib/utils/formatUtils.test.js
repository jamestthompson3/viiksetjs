'use strict';

var _formatUtils = require('./formatUtils');

var format = _interopRequireWildcard(_formatUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe('Format Utilties', function () {
  describe('formats ticks', function () {
    it('takes a data point and formats it to the following time', function () {
      var result = format.formatTime(new Date('December 31, 2017 12:00:01'));
      expect(result).toEqual('Sun Dec 31');
    });
    it('takes a data point and formats it to the following time', function () {
      expect(format.tooltipTime(new Date('December 31, 2017 12:00:01'))).toEqual('Sun Dec 31 12:00');
    });
    it('takes a data point and divides by 1000 and adds "k" if greater than 100', function () {
      expect(format.formatTicks(1000)).toEqual('1k');
      expect(format.formatTicks(10000)).toEqual('10k');
      expect(format.formatTicks(1)).toEqual(1);
    });
  });
});