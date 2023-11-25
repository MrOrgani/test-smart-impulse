import { BasicFormattedDataset } from "@/lib/types";
import { ChartProps } from "react-chartjs-2";

export const stackedBarChartFormatter = (
  datasets: BasicFormattedDataset,
  valueModifier: (value: number, MWhPrice?: number) => number
): ChartProps<"bar", number[]>["data"]["datasets"] => {
  if (!datasets.length) return [];

  const formattedDatasets = datasets.map((dataset) => {
    const formattedValues = dataset.data?.map((datum) => {
      if (!datum || !Array.isArray(datum)) return datum;
      const value = datum[1];
      return dataset.datasetType === "total"
        ? valueModifier(value) / 100
        : valueModifier(value);
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
