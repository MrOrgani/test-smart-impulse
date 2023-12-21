import type {
  AggregatedDataset,
  BasicFormattedDataset,
  TemporalAggregations,
} from '../lib/types';

import { getTimeAggregation } from './getTimeAggregation';

export const aggregateDatasets = (
  datasets: BasicFormattedDataset[],
  aggregationType: TemporalAggregations,
  timezone: string,
): AggregatedDataset[] => {
  const aggregatedDatasets = [];

  for (let i = 0; i < datasets.length; i++) {
    const dataset: AggregatedDataset = {
      label: datasets[i].label,
      backgroundColor: datasets[i].backgroundColor,
      data: [],
      datasetType: datasets[i].datasetType,
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
