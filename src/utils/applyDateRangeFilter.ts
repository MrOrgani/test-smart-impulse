import type { BasicFormattedDataset } from "../lib/types";
import type { DateRange } from "react-day-picker";

export const applyDateRangeFilter = (
  datasets: BasicFormattedDataset[],
  dateRange: DateRange | undefined,
): BasicFormattedDataset[] => {
  if (dateRange?.from === undefined || dateRange?.to === undefined) {
    return datasets;
  }

  const { from, to } = dateRange;

  const startFilterRangeTimestamp = from.getTime();
  const endFilterRangeTimestamp = to.getTime();

  const filteredDataSets = datasets.map((dataset) => {
    const filteredData = dataset.data?.map<[EpochTimeStamp, number]>((item) => {
      if (!Array.isArray(item)) return [0, 0];
      const timestamp = item[0];
      return startFilterRangeTimestamp <= timestamp &&
        timestamp <= endFilterRangeTimestamp
        ? item
        : [timestamp, 0];
    });
    const filteredTooltips = dataset.tooltip?.map<[EpochTimeStamp, number]>(
      (item) => {
        if (!Array.isArray(item)) return [0, 0];
        const timestamp = item[0];
        return startFilterRangeTimestamp <= timestamp &&
          timestamp <= endFilterRangeTimestamp
          ? item
          : [timestamp, 0];
      },
    );
    return {
      ...dataset,
      data: filteredData,
      tooltip: filteredTooltips,
    };
  });

  return filteredDataSets;
};
