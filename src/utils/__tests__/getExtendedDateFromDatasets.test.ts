import { FetchedDataSet } from '@/lib/types';

import { getExtendedDateFromDatasets } from '../getExtendedDateFromDatasets';

describe('getExtendedDateFromDatasets', () => {
  it('should return the correct selectableFrom and selectableTo values', () => {
    const datasets = [
      {
        data: [
          [2, 'B'],
          [3, 'C'],
        ],
      },
      {
        data: [
          [1, 'D'],
          [2, 'E'],
          [3, 'F'],
          [4, 'G'],
        ],
      },
    ];

    const [selectableFrom, selectableTo] = getExtendedDateFromDatasets(
      datasets as FetchedDataSet[],
    );

    expect(selectableFrom).toBe(1);
    expect(selectableTo).toBe(4);
  });

  it('should return undefined for selectableFrom and selectableTo if datasets is empty', () => {
    const datasets: FetchedDataSet[] = [];

    const [selectableFrom, selectableTo] =
      getExtendedDateFromDatasets(datasets);

    expect(selectableFrom).toBeUndefined();
    expect(selectableTo).toBeUndefined();
  });
});
