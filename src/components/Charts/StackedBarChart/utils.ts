import type { BasicFormattedDataset, FetchedDataSet } from '@/lib/types';

interface IStackedBarChartDataset {
  datasetType: FetchedDataSet['type'];
  label: string;
  backgroundColor: string;
  data: number[];
  tooltip: number[];
}

export const stackedBarChartFormatter = (
  datasets: BasicFormattedDataset[],
  valueModifier: (value: number, MWhPrice?: number) => number,
): Array<IStackedBarChartDataset> => {
  if (!datasets?.length) return [];
  const formattedDatasets: Array<IStackedBarChartDataset> = [];

  for (let datasetIndex = 0; datasetIndex < datasets.length; datasetIndex++) {
    const formattedDataset: IStackedBarChartDataset = {
      datasetType: datasets[datasetIndex].datasetType,
      backgroundColor: datasets[datasetIndex].backgroundColor,
      label: datasets[datasetIndex].label,
      data: [],
      tooltip: [],
    };

    for (
      let datumIndex = 0;
      datumIndex < datasets[datasetIndex].data.length;
      datumIndex++
    ) {
      const [, value] = datasets[datasetIndex].data[datumIndex];

      formattedDataset.data.push(
        formattedDataset.datasetType === 'total'
          ? valueModifier(value) / 100
          : valueModifier(value),
      );
      formattedDataset.tooltip.push(valueModifier(value));
    }
    formattedDatasets.push(formattedDataset);
  }

  return formattedDatasets;
};
