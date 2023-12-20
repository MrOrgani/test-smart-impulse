import type { DateRange } from 'react-day-picker';

import type { BasicFormattedDataset } from '../lib/types';

export const applyDateRangeFilter = (
  datasets: BasicFormattedDataset[],
  dateRange: DateRange,
) => {
  if (dateRange?.from === undefined || dateRange?.to === undefined) {
    return datasets;
  }

  const { from, to } = dateRange;
  const startFilterRangeTimestamp = from.getTime();
  const endFilterRangeTimestamp = to.getTime();

  const filteredDataSets = [];

  for (let i = 0; i < datasets.length; i++) {
    const dataset = datasets[i];

    for (let j = 0; j < dataset.data.length; j++) {
      const item = dataset.data[j];
      if (!Array.isArray(item)) {
        dataset['data'][j] = [0, 0];
        dataset['tooltip'][j] = [0, 0];
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
        dataset['tooltip'][j] = [timestamp, 0];
      }
    }

    filteredDataSets.push(dataset);
  }

  return filteredDataSets;
};
