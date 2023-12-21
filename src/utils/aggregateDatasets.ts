import type {
  AggregatedDataset,
  FetchedDataset,
  TemporalAggregations,
} from '../lib/types';

import { getTimeAggregation } from './getTimeAggregation';

export const aggregateDatasets = (
  datasets: FetchedDataset[],
  aggregationType: TemporalAggregations,
  timezone: string,
): AggregatedDataset[] => {
  const aggregatedDatasets = [];

  for (let i = 0; i < datasets.length; i++) {
    const dataset: AggregatedDataset = {
      ...datasets[i],
      data: [],
    };

    const reduceDataMap: Record<string, number> = {};

    for (let j = 0; j < datasets[i].data.length; j++) {
      const [timestamp, value] = datasets[i].data[j];
      const timestampByTimeAggregation: string = getTimeAggregation(
        timestamp,
        aggregationType,
        timezone,
      );
      reduceDataMap[timestampByTimeAggregation] = reduceDataMap[
        timestampByTimeAggregation
      ]
        ? reduceDataMap[timestampByTimeAggregation] + value
        : value;
    }
    dataset.data = Object.entries(reduceDataMap);

    aggregatedDatasets.push(dataset);
  }
  return aggregatedDatasets;
};
