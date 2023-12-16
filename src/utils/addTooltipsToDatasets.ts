import type {
  EnergyConsumptionDataset,
  BasicFormattedDataset,
} from "../lib/types";

export const addTooltipsToDatasets = (
  data: EnergyConsumptionDataset[],
): BasicFormattedDataset[] => {
  if (!data?.length) return [];

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
      };
    })
    .sort((a) => {
      return a.datasetType === "total" ? 1 : -1;
    });

  return basicDatasets;
};
