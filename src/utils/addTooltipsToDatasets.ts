import type { BasicFormattedDataset, FetchedDataSet } from '../lib/types';

export const addTooltipsToDatasets = (
  data: FetchedDataSet[],
): BasicFormattedDataset[] => {
  if (!data?.length) return [];
  const localData = data;
  localData.sort((a) => {
    return a.type === 'total' ? 1 : -1;
  });
  const datasets = [];

  for (let datasetIndex = 0; datasetIndex < localData.length; datasetIndex++) {
    const { type, label, color, data: itemData } = localData[datasetIndex];
    const formattedData = [];

    for (let datumIndex = 0; datumIndex < itemData.length; datumIndex++) {
      formattedData.push(itemData[datumIndex]);
    }

    const dataset = {
      datasetType: type,
      label,
      backgroundColor: color,
      data: formattedData,
      tooltip: formattedData,
    };
    datasets.push(dataset);
  }

  return datasets;
};
