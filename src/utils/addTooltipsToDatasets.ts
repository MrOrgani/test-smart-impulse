import type {
  EnergyConsumptionDatasets,
  EnergyConsumptionDataset,
  BasicFormattedDatasets,
} from "../lib/types";

export const addTooltipsToDatasets = (
  data: EnergyConsumptionDatasets,
): BasicFormattedDatasets => {
  if (data.length < 1) return [];

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
