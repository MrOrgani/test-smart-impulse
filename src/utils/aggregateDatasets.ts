import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import type {
  AggregatedDataset,
  FetchedDataset,
  TemporalAggregations,
} from '../lib/types';

dayjs.extend(isBetween);

import { DateRange } from 'react-day-picker';

import { getTimeAggregation } from './getTimeAggregation';

export const aggregateDatasets = (
  datasets: FetchedDataset[],
  aggregationType: TemporalAggregations,
  dateRange: DateRange,
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

      if (
        !dayjs(timestampByTimeAggregation).isBetween(
          dateRange.from,
          dateRange.to,
          aggregationType,
          '[]',
        )
      ) {
        reduceDataMap[timestampByTimeAggregation] = 0;
        continue;
      }

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
