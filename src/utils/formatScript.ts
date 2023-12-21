import { DateRange } from 'react-day-picker';

import { AggregatedDataset, FetchedDataset } from '@/lib/types';

import { aggregateDatasets } from './aggregateDatasets';

export type IWorkerResult = {
  aggregatedDatasets: AggregatedDataset[];
  buildingId: string;
};

export type IWorkerRequest = {
  datasets: FetchedDataset[];
  temporalAggregation: string;
  timezone: string;
  buildingId: string;
  dateRange: DateRange;
};

onmessage = (e) => {
  const { datasets, temporalAggregation, timezone, buildingId, dateRange } =
    e.data;

  const aggregatedDatasets = aggregateDatasets(
    datasets,
    temporalAggregation,
    dateRange,
    timezone,
  );

  postMessage({
    result: { aggregatedDatasets, buildingId },
  });
};
