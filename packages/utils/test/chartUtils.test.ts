import * as chart from '../src/chartUtils';

describe('Chart Utilities', () => {
  describe('create scales', () => {
    it('creates a linear x scale given timeseries data', () => {
      const xPoints = [
        new Date('2017-10-06T00:00:00.000Z'),
        new Date('2017-11-06T00:00:00.000Z'),
        new Date('2017-11-06T00:05:00.000Z'),
        new Date('2017-11-06T00:06:00.000Z'),
      ];
      const result = chart.determineXScale({
        xPoints,
        width: 400,
        margin: { top: 10, bottom: 10, left: 10, right: 10 },
      });
      expect(result.domain()).toEqual([
        new Date('2017-10-06T00:00:00.000Z'),
        new Date('2017-11-06T00:06:00.000Z'),
      ]);
      expect(result.range()).toEqual([10, 400]);
    });
    it('creates a linear y scale given numeric data', () => {
      const yPoints = [0, 355, 1, 34, 433, 3];
      const result = chart.determineYScale({
        yPoints,
        height: 400,
        margin: { top: 10, bottom: 10, left: 10, right: 10 },
      });
      expect(result.domain()).toEqual([0, 433]);
      expect(result.range()).toEqual([400, 10]);
    });
    it('creates a Y ordinal scale given ordinal data', () => {
      const yPoints = ['cats', 'dogs', 'horses'];
      const result = chart.determineYScale({
        yPoints,
        type: 'ordinal',
        orientation: 'horizontal',
        height: 400,
        margin: { top: 10, bottom: 10, left: 10, right: 10 },
      });
      expect(result.domain()).toEqual(['cats', 'dogs', 'horses']);
      expect(result.range()).toEqual([400, 10]);
    });
    it('creates a Y linear scale given linear data with an ordinal chart type', () => {
      const yPoints = [0, 45, 234, 553, 3];
      const result = chart.determineYScale({
        yPoints,
        type: 'ordinal',
        height: 400,
        margin: { top: 10, bottom: 10, left: 10, right: 10 },
      });
      expect(result.domain()).toEqual([0, 553]);
      expect(result.range()).toEqual([400, 10]);
    });
    it('creates a X ordinal scale given ordinal data', () => {
      const xPoints = ['cats', 'dogs', 'horses'];
      const result = chart.determineXScale({
        xPoints,
        type: 'ordinal',
        width: 400,
        margin: { top: 10, bottom: 10, left: 10, right: 10 },
      });
      expect(result.domain()).toEqual(['cats', 'dogs', 'horses']);
      expect(result.range()).toEqual([10, 400]);
    });
    it('creates a X linear scale given linear data with an ordinal chart type', () => {
      const xPoints = [0, 45, 234, 553, 3];
      const result = chart.determineXScale({
        xPoints,
        type: 'ordinal',
        orientation: 'horizontal',
        width: 400,
        margin: { top: 10, bottom: 10, left: 10, right: 10 },
      });
      expect(result.domain()).toEqual([0, 553]);
      expect(result.range()).toEqual([10, 400]);
    });
  });
});
