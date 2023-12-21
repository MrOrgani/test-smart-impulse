import { FetchedDataset } from '@/lib/types';
import { getDateRange } from '@/utils/getDateRange';

describe('getDateRange', () => {
  it('should return the correct date range when selectedDateRange is provided', () => {
    const selectedDateRange = '2022-01-01_2022-01-31';
    const datasets = undefined;

    const result = getDateRange({ selectedDateRange, datasets });

    expect(result.from).toEqual(new Date('2022-01-01'));
    expect(result.to).toEqual(new Date('2022-01-31'));
  });

  it('should return the correct date range when selectedDateRange is not provided', () => {
    const selectedDateRange = undefined;
    const datasets = [
      {
        data: [
          [1627833600000, 10], // 2021-08-01T16:00:00.000Z Sunday
          [1627920000000, 20], // 2021-08-02T16:00:00.000Z Monday in timestamp is 1627920000000
          [1628006400000, 30], // 2021-08-03T16:00:00.000Z Tuesday in timestamp is 1628006400000
        ],
      },
      {
        data: [
          [1627833600000, 10], // 2021-08-01T16:00:00.000Z Sunday
          [1627920000000, 20], // 2021-08-02T16:00:00.000Z Monday in timestamp is 1627920000000
          [1628006400000, 30], // 2021-08-03T16:00:00.000Z Tuesday in timestamp is 1628006400000
          [1628092800000, 40], // 2021-08-04T16:00:00.000Z Wednesday in timestamp is 1628092800000
        ],
      },
    ] as FetchedDataset[];

    const result = getDateRange({ selectedDateRange, datasets });

    expect(result.from).toEqual(new Date('2021-08-01T16:00:00.000Z'));
    expect(result.to).toEqual(new Date('2021-08-04T16:00:00.000Z'));
  });

  it('should return undefined for from and to when no date range is available', () => {
    const selectedDateRange = undefined;
    const datasets = undefined;

    const result = getDateRange({ selectedDateRange, datasets });

    expect(result.from).toBeUndefined();
    expect(result.to).toBeUndefined();
  });
});
