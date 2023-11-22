import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { EnergyConsumptionData } from "./types";
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
  const labels = longestDataset.data.map((item: any) => item[0]);
  return labels;
};

export const applyDateRangeFilter = (
  data: EnergyConsumptionData,
  dateRange: DateRange | undefined
) => {
  console.log("applyDateRangeFilter", dateRange);
  if (!dateRange?.from || !dateRange?.to) {
    return data.map((dataset) => ({
      // ...dataset,
      color: dataset.color,
      data: dataset.data,
    }));
  }
  const { from, to } = dateRange;

  const [startDateTimestamp, endDateTimestamp] = [from.getTime(), to.getTime()];
  console.log(
    "📆 applyDateRangeFilter",
    from,
    to,
    startDateTimestamp,
    endDateTimestamp
  );

  const filteredDataSets: ChartProps["data"]["datasets"] = data.map(
    (dataset) => ({
      // ...dataset,
      data: dataset.data.filter(([timeStamp]) => {
        return startDateTimestamp <= timeStamp && timeStamp <= endDateTimestamp;
      }),
    })
  );

  return filteredDataSets;
};
