import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  ArrayElement,
  EnergyConsumptionData,
  EnergyConsumptionDataElement,
  MeasureUnitLabels,
  TemporalAggregations,
} from "./types";
import { DateRange } from "react-day-picker";
import { ChartProps } from "react-chartjs-2";
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
  data: EnergyConsumptionData,
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
  datasets: Array<
    ArrayElement<ChartProps["data"]["datasets"]> & {
      datasetType: EnergyConsumptionDataElement["type"];
      tooltip: EnergyConsumptionDataElement["data"];
      data: EnergyConsumptionDataElement["data"];
    }
  >,
  aggregationType: TemporalAggregations,
  timezone: string
) => {
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

const getValueModifier = (measureUnit: keyof MeasureUnitLabels) => {
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
  data: EnergyConsumptionData,
  dateRange: DateRange | undefined,
  aggregationType: TemporalAggregations,
  timezone: string,
  measureUnit: keyof MeasureUnitLabels
): Array<
  ArrayElement<ChartProps["data"]["datasets"]> & {
    datasetType: EnergyConsumptionDataElement["type"];
    tooltip: number[];
  }
> => {
  if (!data.length) return [];
  const valueModifier = getValueModifier(measureUnit);

  const basicDatasets = formatBasicDatasets(data, valueModifier);
  const timeFilteredDatasets = applyDateRangeFilter(basicDatasets, dateRange);
  const aggregatedDatasets = aggregateDatasets(
    timeFilteredDatasets,
    aggregationType,
    timezone
  );

  const formattedDatasets = applyValueDivider(
    aggregatedDatasets,
    valueModifier
  );

  return formattedDatasets;
};

const getMaxValue = (data: EnergyConsumptionData) => {
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
  data: EnergyConsumptionData,
  valueModifier: (value: number) => number
): Array<
  ArrayElement<ChartProps["data"]["datasets"]> & {
    datasetType: EnergyConsumptionDataElement["type"];
    tooltip: EnergyConsumptionDataElement["data"];
    data: EnergyConsumptionDataElement["data"];
  }
> => {
  if (!data.length) return [];

  const maxValue = getMaxValue(data);

  const basicDatasets = data
    .map((item: EnergyConsumptionDataElement) => {
      return {
        datasetType: item.type,
        label: item.label,
        backgroundColor: item.color,
        data: item.data.map(([timestamp, value]) => [timestamp, value]) as [
          number,
          number
        ][],
        tooltip: item.data.map(([timestamp, value]) => [timestamp, value]) as [
          number,
          number
        ][],
        ...(item.type === "total" && {
          data: item.data.map(([timestamp]) => [
            timestamp,
            valueModifier(maxValue) / 100, // 1% of the max value, only to display the total as a line
          ]) as [number, number][],
        }),
      };
    })
    .sort((a) => {
      return a.datasetType === "total" ? 1 : -1;
    });

  return basicDatasets;
};

export const applyDateRangeFilter = (
  datasets: Array<
    ArrayElement<ChartProps["data"]["datasets"]> & {
      datasetType: EnergyConsumptionDataElement["type"];
      tooltip: EnergyConsumptionDataElement["data"];
      data: EnergyConsumptionDataElement["data"];
    }
  >,
  dateRange: DateRange | undefined
): Array<
  ArrayElement<ChartProps["data"]["datasets"]> & {
    datasetType: EnergyConsumptionDataElement["type"];
    tooltip: EnergyConsumptionDataElement["data"];
    data: EnergyConsumptionDataElement["data"];
  }
> => {
  if (!dateRange || !dateRange.from || !dateRange.to) return datasets;

  const { from, to } = dateRange;

  const startFilterRangeTimestamp = from.getTime();
  const endFilterRangeTimestamp = to.getTime();

  const filteredDataSets = datasets.map((dataset) => {
    const filteredData = dataset.data?.map((item) => {
      if (!item || !Array.isArray(item)) return [0, 0];
      const timestamp = item[0];
      return startFilterRangeTimestamp <= timestamp &&
        timestamp <= endFilterRangeTimestamp
        ? item
        : [timestamp, 0];
    }) as EnergyConsumptionDataElement["data"];
    const filteredTooltips = dataset.tooltip?.map((item) => {
      if (!item || !Array.isArray(item)) return [0, 0];
      const timestamp = item[0];
      return startFilterRangeTimestamp <= timestamp &&
        timestamp <= endFilterRangeTimestamp
        ? item
        : [timestamp, 0];
    }) as EnergyConsumptionDataElement["data"];
    return {
      ...dataset,
      data: filteredData,
      tooltip: filteredTooltips,
    };
  });

  return filteredDataSets;
};

const applyValueDivider = (
  datasets: Array<
    ArrayElement<ChartProps["data"]["datasets"]> & {
      datasetType: EnergyConsumptionDataElement["type"];
      tooltip: EnergyConsumptionDataElement["data"];
    }
  >,
  valueModifier: (value: number, MWhPrice?: number) => number
) => {
  if (!datasets.length) return [];

  const formattedDatasets = datasets.map((dataset) => {
    const formattedValues = dataset.data?.map((datum) => {
      if (!datum || !Array.isArray(datum)) return datum;
      const value = datum[1];
      return dataset.datasetType === "total" ? value : valueModifier(value);
    });
    const formattedtooltips = dataset.tooltip?.map((datum) => {
      if (!datum || !Array.isArray(datum)) return datum;
      const value = datum[1];
      return valueModifier(value);
    });

    return {
      ...dataset,
      data: formattedValues,
      tooltip: formattedtooltips,
    };
  });

  return formattedDatasets;
};
