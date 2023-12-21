import dayjs from 'dayjs';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsUtc from 'dayjs/plugin/utc';

import type { AggregatedDataset } from '@/lib/types';

import { aggregateDatasets } from '../aggregateDatasets';

dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);

describe('aggregateDatasets', () => {
  it('should return an empty array if datasets is empty', () => {
    const datasets: AggregatedDataset[] = [];
    const aggregationType = 'day';
    const timezone = 'Europe/Paris';

    const result = aggregateDatasets(datasets, aggregationType, timezone);

    expect(result).toEqual([]);
  });

  it('should aggregate the data and tooltips correctly', () => {
    const datasets = [
      {
        type: 'total',
        label: 'Energie totale',
        color: '#FF0000',
        data: [
          [1627833600000, 10], // 2021-08-01T16:00:00.000Z Sunday
          [1627920000000, 20], // 2021-08-02T16:00:00.000Z Monday in timestamp is 1627920000000
          [1628006400000, 30], // 2021-08-03T16:00:00.000Z Tuesday in timestamp is 1628006400000
        ],
      },
      {
        type: 'element',
        label: 'Autres éclairages',
        color: '#FF0000',
        data: [
          [1627833600000, 5], // 2021-08-01T16:00:00.000Z Sunday
          [1627920000000, 15], // 2021-08-02T16:00:00.000Z Monday in timestamp is 1627920000000
          [1628006400000, 25], // 2021-08-03T16:00:00.000Z Tuesday in timestamp is 1628006400000
        ],
      },
    ] as AggregatedDataset[];
    const aggregationType = 'month';
    const timezone = 'Europe/Paris';

    const result = aggregateDatasets(datasets, aggregationType, timezone);

    expect(result).toEqual([
      {
        type: 'total',
        label: 'Energie totale',
        color: '#FF0000',
        data: [['2021-07-31T22:00:00.000Z', 60]],
      },
      {
        color: '#FF0000',
        label: 'Autres éclairages',
        data: [['2021-07-31T22:00:00.000Z', 45]],
        type: 'element',
      },
    ]);
  });
});
