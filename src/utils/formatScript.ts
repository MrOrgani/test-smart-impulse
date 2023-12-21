import { aggregateDatasets } from './aggregateDatasets';
import { applyDateRangeFilter } from './applyDateRangeFilter';

onmessage = (e) => {
  const { datasets, temporalAggregation, timezone, buildingId, dateRange } =
    e.data;

  const timeFilteredDatasets = applyDateRangeFilter(datasets, dateRange);
  const aggregatedDatasets = aggregateDatasets(
    timeFilteredDatasets,
    temporalAggregation,
    timezone,
  );

  postMessage({ result: { basicDatasets: aggregatedDatasets, buildingId } });
};
