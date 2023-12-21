import type { DateRange } from 'react-day-picker';

import type { FetchedDataset } from '../lib/types';

export const applyDateRangeFilter = (
  data: FetchedDataset[],
  dateRange: DateRange | undefined,
) => {
  if (dateRange?.from === undefined || dateRange?.to === undefined) {
    return data;
  }

  const localDatasets = data;
  localDatasets.sort((a) => {
    return a.type === 'total' ? 1 : -1;
  });

  const { from, to } = dateRange;
  const startFilterRangeTimestamp = from.getTime();
  const endFilterRangeTimestamp = to.getTime();

  const filteredDataSets = [];

  for (let i = 0; i < localDatasets.length; i++) {
    const dataset = localDatasets[i];

    for (let j = 0; j < dataset.data.length; j++) {
      const item = dataset.data[j];
      if (!Array.isArray(item)) {
        dataset['data'][j] = [0, 0];
        continue;
      }
      const timestamp = item[0];
      if (
        startFilterRangeTimestamp <= timestamp &&
        timestamp <= endFilterRangeTimestamp
      ) {
        continue;
      } else {
        dataset['data'][j] = [timestamp, 0];
      }
    }

    filteredDataSets.push(dataset);
  }

  return filteredDataSets;
};
