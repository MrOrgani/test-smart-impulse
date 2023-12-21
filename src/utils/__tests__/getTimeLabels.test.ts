import dayjs from 'dayjs';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsUtc from 'dayjs/plugin/utc';

import type { FetchedDataset } from '@/lib/types';

import { getTimeLabels } from '../getTimeLabels';

const date1 = 1627833600000; // 2021-08-01T16:00:00.000Z Sunday
const date2 = 1627920000000; // 2021-08-02T16:00:00.000Z Monday
const date3 = 1628006400000; // 2021-08-03T16:00:00.000Z Tuesday

dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);

describe('getTimeLabels', () => {
  it('should return an empty array if data is empty', () => {
    const data: FetchedDataset[] = [];
    const aggregationType = 'day';
    const timezone = 'Europe/Paris';

    const result = getTimeLabels(data, aggregationType, timezone);

    expect(result).toEqual([]);
  });

  it('should return an array of aggregated timestamps', () => {
    const data = [
      {
        data: [
          [date1, 1],
          [date2, 2],
          [date3, 3],
        ],
      },
      {
        data: [
          [date1, 1],
          [date2, 2],
        ],
      },
      {
        data: [[date1, 1]],
      },
    ];
    const aggregationType = 'day';
    const timezone = 'Europe/Paris';

    const result = getTimeLabels(
      data as FetchedDataset[],
      aggregationType,
      timezone,
    );

    expect(result).toEqual([
      '2021-08-01T16:00:00.000Z',
      '2021-08-02T16:00:00.000Z',
      '2021-08-03T16:00:00.000Z',
    ]);
  });
});
