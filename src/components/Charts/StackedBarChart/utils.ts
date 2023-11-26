import type { BasicFormattedDatasets } from "@/lib/types";
import type { ChartProps } from "react-chartjs-2";

export const stackedBarChartFormatter = (
  datasets: BasicFormattedDatasets,
  valueModifier: (value: number, MWhPrice?: number) => number,
): ChartProps<"bar", number[]>["data"]["datasets"] => {
  if (datasets.length < 1) return [];

  const formattedDatasets = datasets.map((dataset) => {
    const formattedValues = dataset.data.map((datum) => {
      if (!Array.isArray(datum)) return datum;
      const value = datum[1];
      return dataset.datasetType === "total"
        ? valueModifier(value) / 100
        : valueModifier(value);
    });
    const formattedtooltips = dataset.tooltip?.map((datum) => {
      if (!Array.isArray(datum)) return datum;
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
