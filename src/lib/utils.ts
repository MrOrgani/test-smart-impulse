import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  ArrayElement,
  EnergyConsumptionData,
  EnergyConsumptionDataElement,
} from "./types";
import { DateRange } from "react-day-picker";
import { ChartProps } from "react-chartjs-2";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeLabels = (
  data: EnergyConsumptionData,
  aggregationType: "day" | "week" | "month" | "year" = "day"
) => {
  // Get index values from the longest dataset
  const longestDataset = data.reduce((acc, item) => {
    return item.data.length > acc.data.length ? item : acc;
  }, data[0]);

  // Get the labels from the longest dataset
  const timestamps = longestDataset.data.map(([timestamp]) => timestamp);

  const aggregatedTimestamps = aggregateTimestamps(timestamps, aggregationType);

  return aggregatedTimestamps;
};

const aggregateTimestamps = (
  timestamps: number[],
  aggregationType: "day" | "week" | "month" | "year"
): number[] => {
  const aggregatedTimestamps: number[] = [];

  timestamps.forEach((timestamp) => {
    const date = new Date(timestamp);

    switch (aggregationType) {
      case "day":
        const aggregatedTimestamp = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        ).getTime();
        if (!aggregatedTimestamps.includes(aggregatedTimestamp)) {
          aggregatedTimestamps.push(aggregatedTimestamp);
        }
        break;
      case "week":
        const firstDayOfWeek = date.getDate() - date.getDay();
        const aggregatedTimestamp2 = new Date(
          date.getFullYear(),
          date.getMonth(),
          firstDayOfWeek
        ).getTime();
        if (!aggregatedTimestamps.includes(aggregatedTimestamp2)) {
          aggregatedTimestamps.push(aggregatedTimestamp2);
        }
        break;
      case "month":
        const aggregatedTimestamp3 = new Date(
          date.getFullYear(),
          date.getMonth()
        ).getTime();
        if (!aggregatedTimestamps.includes(aggregatedTimestamp3)) {
          aggregatedTimestamps.push(aggregatedTimestamp3);
        }
        break;
      case "year":
        const aggregatedTimestamp4 = new Date(date.getFullYear(), 0).getTime();
        if (!aggregatedTimestamps.includes(aggregatedTimestamp4)) {
          aggregatedTimestamps.push(aggregatedTimestamp4);
        }
        break;
    }
  });

  return aggregatedTimestamps;
};

const aggregateDatasets = (
  datasets: Array<
    ArrayElement<ChartProps["data"]["datasets"]> & {
      datasetType: EnergyConsumptionDataElement["type"];
      tooltip: EnergyConsumptionDataElement["data"];
    }
  >,
  aggregationType: "day" | "week" | "month" | "year" = "day"
) => {
  if (!datasets.length) return [];

  const aggregatedDatasets = datasets.map((dataset) => {
    const aggregatedTimestamps = new Map<number, number>();
    dataset.data.forEach((datum) => {
      if (!datum || !Array.isArray(datum)) return datum;
      const [timestamp, value] = datum;
      const date = new Date(timestamp);

      switch (aggregationType) {
        case "day":
          const aggregatedTimestamp = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          ).getTime();
          if (aggregatedTimestamps.get(aggregatedTimestamp)) {
            aggregatedTimestamps.set(
              aggregatedTimestamp,
              aggregatedTimestamps.get(aggregatedTimestamp)! + value
            );
          } else {
            aggregatedTimestamps.set(aggregatedTimestamp, value);
          }
          break;
        case "week":
          const firstDayOfWeek = date.getDate() - date.getDay();
          const aggregatedTimestamp2 = new Date(
            date.getFullYear(),
            date.getMonth(),
            firstDayOfWeek
          ).getTime();
          if (aggregatedTimestamps.get(aggregatedTimestamp2)) {
            aggregatedTimestamps.set(
              aggregatedTimestamp2,
              aggregatedTimestamps.get(aggregatedTimestamp2)! + value || 0
            );
          } else {
            aggregatedTimestamps.set(aggregatedTimestamp2, value);
          }
          break;
        case "month":
          const aggregatedTimestamp3 = new Date(
            date.getFullYear(),
            date.getMonth()
          ).getTime();
          if (aggregatedTimestamps.get(aggregatedTimestamp3)) {
            aggregatedTimestamps.set(
              aggregatedTimestamp3,
              aggregatedTimestamps.get(aggregatedTimestamp3)! + value || 0
            );
          } else {
            aggregatedTimestamps.set(aggregatedTimestamp3, value);
          }
          break;
        case "year":
          const aggregatedTimestamp4 = new Date(
            date.getFullYear(),
            0
          ).getTime();
          if (aggregatedTimestamps.get(aggregatedTimestamp4)) {
            aggregatedTimestamps.set(
              aggregatedTimestamp4,
              aggregatedTimestamps.get(aggregatedTimestamp4)! + value || 0
            );
          } else {
            aggregatedTimestamps.set(aggregatedTimestamp4, value);
          }
          break;
      }
    });

    console.log("aggregatedDatasets", [...aggregatedTimestamps.entries()]);

    // reduce the aggregated and summ the values

    const aggregatedDataMap = [...aggregatedTimestamps.entries()].reduce(
      (acc, item) => {
        if (!item || !Array.isArray(item)) return acc;
        const timestamp = item[0];
        const value = item[1];
        return acc.set(timestamp, (acc.get(timestamp) || 0) + value);
      },
      new Map<number, number>()
    );

    // console.log("aggregatedData", [...aggregatedDataMap.entries()]);
    return {
      ...dataset,
      data: [...aggregatedDataMap.entries()],
    };
  });

  return aggregatedDatasets;
};

export const formatDatasets = (
  data: EnergyConsumptionData,
  dateRange: DateRange | undefined
): Array<
  ArrayElement<ChartProps["data"]["datasets"]> & {
    datasetType: EnergyConsumptionDataElement["type"];
    tooltip: number[];
  }
> => {
  if (!data.length) return [];

  const basicDatasets = formatBasicDatasets(data);
  debugger;
  const timeFilteredDatasets = applyDateRangeFilter(basicDatasets, dateRange);
  const aggregatedDatasets = aggregateDatasets(timeFilteredDatasets);
  const formattedDatasets = applyValueDivider(aggregatedDatasets);

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
  data: EnergyConsumptionData
): Array<
  ArrayElement<ChartProps["data"]["datasets"]> & {
    datasetType: EnergyConsumptionDataElement["type"];
    tooltip: EnergyConsumptionDataElement["data"];
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
          grouped: false,
          data: item.data.map(([timestamp]) => [
            timestamp,
            maxValue / 100000000, // 100M, value to display the total dataset on top of the chart as a line
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
    }
  >,
  dateRange: DateRange | undefined
): Array<
  ArrayElement<ChartProps["data"]["datasets"]> & {
    datasetType: EnergyConsumptionDataElement["type"];
    tooltip: EnergyConsumptionDataElement["data"];
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
    return {
      ...dataset,
      data: filteredData,
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
  divider = 1000000
) => {
  if (!datasets.length) return [];

  const formattedDatasets = datasets.map((dataset) => {
    const formattedValues = dataset.data?.map((datum) => {
      if (!datum || !Array.isArray(datum)) return datum;
      const value = datum[1];
      return dataset.datasetType === "total" ? value : value / divider;
    });
    const formattedtooltips = dataset.tooltip?.map((datum) => {
      if (!datum || !Array.isArray(datum)) return datum;
      const value = datum[1];
      return value / divider;
    });

    return {
      ...dataset,
      data: formattedValues,
      tooltip: formattedtooltips,
    };
  });

  return formattedDatasets;
};
