import dayjs from 'dayjs';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsUtc from 'dayjs/plugin/utc';

import type { TemporalAggregations } from '../../lib/types';
import { getTimeAggregation } from '../getTimeAggregation';

import 'vitest';

dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);

const date1 = 1627833600000; // 2021-08-01T16:00:00.000Z Sunday
const date2 = 1627920000000; // 2021-08-02T16:00:00.000Z Monday
const date3 = 1628006400000; // 2021-08-03T16:00:00.000Z Tuesday

describe('getTimeAggregation', () => {
  it('should return the aggregated data for daily aggregation', () => {
    const data = [
      [date1, 10],
      [date2, 20],
      [date3, 30],
    ] as Array<[number, number]>;
    const aggregationType: TemporalAggregations = 'day';
    const timezone = 'Europe/Paris';

    const result = data.map(([timeStamp]) =>
      getTimeAggregation(timeStamp, aggregationType, timezone),
    );

    expect(result).toEqual([
      '2021-08-01T16:00:00.000Z',
      '2021-08-02T16:00:00.000Z',
      '2021-08-03T16:00:00.000Z',
    ]);
  });

  it('should return the aggregated data for weekly aggregation', () => {
    const data = [
      [date1, 10],
      [date2, 20],
      [date3, 30],
    ] as Array<[number, number]>;
    const aggregationType: TemporalAggregations = 'week';
    const timezone = 'Europe/Paris';

    const result = data.map(([timeStamp]) =>
      getTimeAggregation(timeStamp, aggregationType, timezone),
    );
    expect(result).toEqual([
      '2021-07-31T22:00:00.000Z',
      '2021-07-31T22:00:00.000Z',
      '2021-07-31T22:00:00.000Z',
    ]);
  });

  it('should return the aggregated data for monthly aggregation', () => {
    const data = [
      [date1, 10],
      [date2, 20],
      [date3, 30],
    ] as Array<[number, number]>;
    const aggregationType: TemporalAggregations = 'month';
    const timezone = 'Europe/Paris';

    const result = data.map(([timeStamp]) =>
      getTimeAggregation(timeStamp, aggregationType, timezone),
    );
    expect(result).toEqual([
      '2021-07-31T22:00:00.000Z',
      '2021-07-31T22:00:00.000Z',
      '2021-07-31T22:00:00.000Z',
    ]);
  });
});
