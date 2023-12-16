import type { BasicFormattedDataset, TemporalAggregations } from "../lib/types";
import { getDataAggregatedByTimeAggregation } from "./getDataAggregatedByTimeAggregation";

export const aggregateDatasets = (
  datasets: BasicFormattedDataset[],
  aggregationType: TemporalAggregations,
  timezone: string,
): BasicFormattedDataset[] => {
  if (datasets.length < 1) return [];

  const aggregatedDatasets = datasets.map((dataset) => {
    // aggregate the data by the aggregation type
    const dataAggregatedByTimeAggregation = getDataAggregatedByTimeAggregation(
      dataset.data,
      aggregationType,
      timezone,
    ).entries();
    // reduce the aggregated and summ the values
    const reduceDataMap = [...dataAggregatedByTimeAggregation]
      .reduce((acc, item) => {
        if (!Array.isArray(item)) return acc;
        const timestamp = item[0];
        const value = item[1];

        return acc.set(
          timestamp,
          acc.has(timestamp) ? acc.get(timestamp) + value : value,
        );
      }, new Map())
      .entries();

    // aggregate the tooltips by the aggregation type
    const tooltipsAggregatedByTimeAggregation =
      getDataAggregatedByTimeAggregation(
        dataset.tooltip,
        aggregationType,
        timezone,
      ).entries();

    const reduceTooltipMap = [...tooltipsAggregatedByTimeAggregation]
      .reduce((acc, item) => {
        if (!Array.isArray(item)) return acc;
        const timestamp = item[0];
        const value = item[1];

        return acc.set(
          timestamp,
          acc.has(timestamp) ? acc.get(timestamp) + value : value,
        );
      }, new Map())
      .entries();

    return {
      ...dataset,
      data: [...reduceDataMap],
      tooltip: [...reduceTooltipMap],
    };
  });

  return aggregatedDatasets;
};
