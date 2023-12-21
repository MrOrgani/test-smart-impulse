import type { FetchedDataset, TemporalAggregations } from '../lib/types';

import { getTimeAggregation } from './getTimeAggregation';

export const getTimeLabels = (
  data: FetchedDataset[],
  aggregationType: TemporalAggregations,
  timezone: string,
): string[] => {
  if (data.length < 1) return [];
  // Get index values from the longest dataset
  const longestDataset = data.reduce((acc, item) => {
    return item.data.length > acc.data.length ? item : acc;
  }, data[0]);

  const aggregatedTimestamps = longestDataset.data.map(([timestamp]) => {
    return getTimeAggregation(timestamp, aggregationType, timezone);
  });

  return aggregatedTimestamps;
};
