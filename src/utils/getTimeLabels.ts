import type { BasicFormattedDataset, TemporalAggregations } from '../lib/types';
import { getDataAggregatedByTimeAggregation } from './getDataAggregatedByTimeAggregation';

export const getTimeLabels = (
  data: BasicFormattedDataset[],
  aggregationType: TemporalAggregations,
  timezone: string,
): string[] => {
  if (data.length < 1) return [];
  // Get index values from the longest dataset
  const longestDataset = data.reduce((acc, item) => {
    return item.data.length > acc.data.length ? item : acc;
  }, data[0]);

  const aggregatedTimestamps = getDataAggregatedByTimeAggregation(
    longestDataset.data,
    aggregationType,
    timezone,
  ).keys();

  return [...aggregatedTimestamps];
};
