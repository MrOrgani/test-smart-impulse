import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  EnergyConsumptionDatasets,
  EnergyConsumptionDataset,
  BasicFormattedDataset,
  MeasureUnitLabels,
  TemporalAggregations,
} from "./types";
import { DateRange } from "react-day-picker";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeLabels = (
  data: EnergyConsumptionDatasets,
  aggregationType: TemporalAggregations,
  timezone: string
) => {
  if (!data.length) return [];
  // Get index values from the longest dataset
  const longestDataset = data.reduce((acc, item) => {
    return item.data.length > acc.data.length ? item : acc;
  }, data[0]);

  const aggregatedTimestamps = getDataAggregatedByTimeAggregation(
    longestDataset.data,
    aggregationType,
    timezone
  ).keys();

  return [...aggregatedTimestamps];
};

const getDataAggregatedByTimeAggregation = (
  data: [number, number][],
  aggregationType: TemporalAggregations,
  timezone: string
) => {
  const temporalFormatMap = new Map<string, number>();
  data.forEach((datum) => {
    if (!datum || !Array.isArray(datum)) return datum;
    const [timestamp, value] = datum;
    const date = dayjs(timestamp).tz(timezone);

    switch (aggregationType) {
      case "day":
        if (temporalFormatMap.get(date.toISOString())) {
          temporalFormatMap.set(
            date.toISOString(),
            temporalFormatMap.get(date.toISOString())! + value
          );
        } else {
          temporalFormatMap.set(date.toISOString(), value);
        }
        break;
      case "week":
        const aggregatedTimestamp2 = date.startOf("week").toISOString();
        if (temporalFormatMap.get(aggregatedTimestamp2)) {
          temporalFormatMap.set(
            aggregatedTimestamp2,
            temporalFormatMap.get(aggregatedTimestamp2)! + value || value
          );
        } else {
          temporalFormatMap.set(aggregatedTimestamp2, value);
        }
        break;
      case "month":
        const aggregatedTimestamp3 = date.format("YYYY-MM");
        if (temporalFormatMap.get(aggregatedTimestamp3)) {
          temporalFormatMap.set(
            aggregatedTimestamp3,
            temporalFormatMap.get(aggregatedTimestamp3)! + value || value
          );
        } else {
          temporalFormatMap.set(aggregatedTimestamp3, value);
        }
        break;
      case "year":
        const aggregatedTimestamp4 = date.format("YYYY");
        if (temporalFormatMap.get(aggregatedTimestamp4)) {
          temporalFormatMap.set(
            aggregatedTimestamp4,
            temporalFormatMap.get(aggregatedTimestamp4)! + value || value
          );
        } else {
          temporalFormatMap.set(aggregatedTimestamp4, value);
        }
        break;
    }
  });
  return temporalFormatMap;
};

const aggregateDatasets = (
  datasets: BasicFormattedDataset,
  aggregationType: TemporalAggregations,
  timezone: string
): BasicFormattedDataset => {
  if (!datasets.length) return [];

  const aggregatedDatasets = datasets.map((dataset) => {
    // aggregate the data by the aggregation type
    const dataAggregatedByTimeAggregation = getDataAggregatedByTimeAggregation(
      dataset.data,
      aggregationType,
      timezone
    ).entries();
    // reduce the aggregated and summ the values
    const reduceDataMap = [...dataAggregatedByTimeAggregation]
      .reduce((acc, item) => {
        if (!item || !Array.isArray(item)) return acc;
        const timestamp = item[0];
        const value = item[1];

        return acc.set(
          timestamp,
          acc.has(timestamp) ? acc.get(timestamp) + value : value
        );
      }, new Map())
      .entries();

    // aggregate the tooltips by the aggregation type
    const tooltipsAggregatedByTimeAggregation =
      getDataAggregatedByTimeAggregation(
        dataset.tooltip,
        aggregationType,
        timezone
      ).entries();

    const reduceTooltipMap = [...tooltipsAggregatedByTimeAggregation]
      .reduce((acc, item) => {
        if (!item || !Array.isArray(item)) return acc;
        const timestamp = item[0];
        const value = item[1];

        return acc.set(
          timestamp,
          acc.has(timestamp) ? acc.get(timestamp) + value : value
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

export const getValueModifier = (measureUnit: keyof MeasureUnitLabels) => {
  switch (measureUnit) {
    case "MWh":
      return (value: number) => value / 1000000;
    case "kWh":
      return (value: number) => value / 1000;
    case "euros":
      return (value: number, MWhPrice = 83) => (value / 1000000) * MWhPrice;
  }
};

export const formatDatasets = (
  data: EnergyConsumptionDatasets,
  dateRange: DateRange | undefined,
  aggregationType: TemporalAggregations,
  timezone: string,
  measureUnit: keyof MeasureUnitLabels
): BasicFormattedDataset => {
  if (!data.length) return [];
  const valueModifier = getValueModifier(measureUnit);

  const basicDatasets = formatBasicDatasets(data, valueModifier);
  const timeFilteredDatasets = applyDateRangeFilter(basicDatasets, dateRange);
  const aggregatedDatasets = aggregateDatasets(
    timeFilteredDatasets,
    aggregationType,
    timezone
  );

  return aggregatedDatasets;
};

const getMaxValue = (data: EnergyConsumptionDatasets) => {
  if (!data.length) return 0;

  const allValues = data
    .map((dataset) => {
      return dataset.data.map((item) => {
        if (!item || !Array.isArray(item)) return 0;
        return item[1];
      });
    })
    .flat();

  return Math.max(...allValues.flat());
};

const formatBasicDatasets = (
  data: EnergyConsumptionDatasets,
  valueModifier: (value: number) => number
): BasicFormattedDataset => {
  if (!data.length) return [];

  const maxValue = getMaxValue(data);

  const basicDatasets = data
    .map((item: EnergyConsumptionDataset) => {
      return {
        datasetType: item.type,
        label: item.label,
        backgroundColor: item.color,
        data: item.data.map<[number, number]>(([timestamp, value]) => [
          timestamp,
          value,
        ]),
        tooltip: item.data.map<[number, number]>(([timestamp, value]) => [
          timestamp,
          value,
        ]),
        ...(item.type === "total" && {
          data: item.data.map<[number, number]>(([timestamp]) => [
            timestamp,
            valueModifier(maxValue) / 100, // 1% of the max value, only to display the total as a line
          ]),
        }),
      };
    })
    .sort((a) => {
      return a.datasetType === "total" ? 1 : -1;
    });

  return basicDatasets;
};

export const applyDateRangeFilter = (
  datasets: BasicFormattedDataset,
  dateRange: DateRange | undefined
): BasicFormattedDataset => {
  if (!dateRange || !dateRange.from || !dateRange.to) return datasets;

  const { from, to } = dateRange;

  const startFilterRangeTimestamp = from.getTime();
  const endFilterRangeTimestamp = to.getTime();

  const filteredDataSets = datasets.map((dataset) => {
    const filteredData = dataset.data?.map<[number, number]>((item) => {
      if (!item || !Array.isArray(item)) return [0, 0];
      const timestamp = item[0];
      return startFilterRangeTimestamp <= timestamp &&
        timestamp <= endFilterRangeTimestamp
        ? item
        : [timestamp, 0];
    });
    const filteredTooltips = dataset.tooltip?.map<[number, number]>((item) => {
      if (!item || !Array.isArray(item)) return [0, 0];
      const timestamp = item[0];
      return startFilterRangeTimestamp <= timestamp &&
        timestamp <= endFilterRangeTimestamp
        ? item
        : [timestamp, 0];
    });
    return {
      ...dataset,
      data: filteredData,
      tooltip: filteredTooltips,
    };
  });

  return filteredDataSets;
};

export const formatDate = (
  date: Date | string | undefined,
  selectedTemporalAggregation: TemporalAggregations,
  timezone: string = "Europe/Paris"
) => {
  if (!date) return "";
  const localDate = dayjs(date).tz(timezone);
  switch (selectedTemporalAggregation) {
    case "day":
      return localDate.format("DD/MM/YYYY");
    case "week":
      return `w${localDate.week()} / ${localDate.format("YYYY")}`;
    case "month":
      return localDate.format("MM/YYYY");
    case "year":
      return localDate.format("YYYY");
  }
};
