import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  ArrayElement,
  EnergyConsumptionData,
  EnergyConsumptionDataElement,
} from "./types";
import { DateRange } from "react-day-picker";
import { ChartProps } from "react-chartjs-2";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeLabels = (data: EnergyConsumptionData) => {
  // Get index values from the longest dataset
  const longestDataset = data.reduce((acc, item) => {
    return item.data.length > acc.data.length ? item : acc;
  }, data[0]);
  // Get the labels from the longest dataset
  const labels = longestDataset.data.map(([timestamp]) => timestamp);
  return labels;
};

export const formatDatasets = (
  data: EnergyConsumptionData,
  dateRange: DateRange | undefined
): ChartProps["data"]["datasets"] => {
  if (!data.length) return [];

  const basicDatasets = formatBasicDatasets(data);
  const timeFilteredDatasets = applyDateRangeFilter(basicDatasets, dateRange);
  const filteredDatasets = applyValueDivider(timeFilteredDatasets);

  return filteredDatasets;
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
          data: item.data.map(([timestamp]) => [timestamp, 0.1]) as [
            number,
            number
          ][],
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
      tooltip: ArrayElement<ChartProps["data"]["datasets"]>["data"];
    }
  >,
  divider = 1000000
) => {
  if (!datasets.length) return [];

  const formattedDatasets = datasets.map((dataset) => {
    const formattedValues = dataset.data?.map((datum) => {
      if (!datum || !Array.isArray(datum)) return datum;
      const value = datum[1];
      // return value / divider;
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
