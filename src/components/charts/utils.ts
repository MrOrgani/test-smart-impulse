import type { AggregatedDataset, FetchedDataset } from '@/lib/types';

interface IStackedBarChartDataset {
  datasetType: FetchedDataset['type'];
  label: string;
  backgroundColor: string;
  data: number[];
  tooltip: number[];
}

export const stackedBarChartFormatter = (
  datasets: AggregatedDataset[],
  valueModifier: (value: number, MWhPrice?: number) => number,
): Array<IStackedBarChartDataset> => {
  if (!datasets?.length) return [];
  const formattedDatasets: Array<IStackedBarChartDataset> = [];

  for (let datasetIndex = 0; datasetIndex < datasets.length; datasetIndex++) {
    const formattedDataset: IStackedBarChartDataset = {
      datasetType: datasets[datasetIndex].type,
      backgroundColor: datasets[datasetIndex].color,
      label: datasets[datasetIndex].label,
      data: [],
      tooltip: [],
    };

    const highestTotalValue =
      formattedDataset.datasetType === 'total'
        ? Math.max(...datasets[datasetIndex].data.map(([, value]) => value))
        : 0;

    for (
      let datumIndex = 0;
      datumIndex < datasets[datasetIndex].data.length;
      datumIndex++
    ) {
      const [, value] = datasets[datasetIndex].data[datumIndex];

      formattedDataset.data.push(
        formattedDataset.datasetType === 'total' && value > 0
          ? valueModifier(highestTotalValue) / 100 // We want to display total as a line
          : valueModifier(value),
      );
      formattedDataset.tooltip.push(valueModifier(value));
    }
    formattedDatasets.push(formattedDataset);
  }

  return formattedDatasets;
};
