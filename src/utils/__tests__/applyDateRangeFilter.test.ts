import type { FetchedDataset } from '@/lib/types';

import { applyDateRangeFilter } from '../applyDateRangeFilter';

describe('applyDateRangeFilter', () => {
  const datasets = [
    {
      data: [
        [1625097600000, 10], // 2021-07-01T16:00:00.000Z Thursday
        [1625184000000, 20], // 2021-07-02T16:00:00.000Z Friday
        [1625270400000, 30], // 2021-07-03T16:00:00.000Z Saturday
      ],
    },
    {
      data: [
        [1625097600000, 40], // 2021-07-01T16:00:00.000Z Thursday
        [1625184000000, 50], // 2021-07-02T16:00:00.000Z Friday
        [1625270400000, 60], // 2021-07-03T16:00:00.000Z Saturday
      ],
    },
  ] as FetchedDataset[];

  it('should return the original datasets if dateRange is undefined', () => {
    const dateRange = undefined;
    const filteredDatasets = applyDateRangeFilter(datasets, dateRange);
    expect(filteredDatasets).toEqual(datasets);
  });

  it('should filter datasets based on the dateRange', () => {
    const dateRange = {
      from: new Date('2021-07-02'),
      to: new Date('2021-07-02'),
    };
    const filteredDatasets = applyDateRangeFilter(datasets, dateRange);
    expect(filteredDatasets).toEqual([
      {
        data: [
          [1625097600000, 0],
          [1625184000000, 20],
          [1625270400000, 0],
        ],
      },
      {
        data: [
          [1625097600000, 0], // 2021-07-01T16:00:00.000Z Thursday
          [1625184000000, 50], // 2021-07-02T16:00:00.000Z Friday
          [1625270400000, 0], // 2021-07-03T16:00:00.000Z Saturday
        ],
      },
    ]);
  });
});
