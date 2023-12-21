import * as d3 from 'd3';

import { AggregatedDataset, FetchedDataset } from '@/lib/types';

export const getExtendedDateFromDatasets = (
  datasets: FetchedDataset[] | AggregatedDataset[] | undefined,
) => {
  if (!datasets?.length) return [];
  const longestDataArray = datasets.reduce((acc, curr) => {
    return curr.data.length > acc.data.length ? curr : acc;
  }, datasets[0]);

  if (typeof longestDataArray?.data[0][0] === 'number') {
    const [selectableFrom, selectableTo] = longestDataArray?.data
      ? d3.extent(longestDataArray?.data as [number, number][], (d) => d[0])
      : [];
    return [selectableFrom, selectableTo];
  }

  const aggregatedData = longestDataArray.data;

  const selectableDateStart = aggregatedData[0][0];
  const selectableDateEnd = aggregatedData[aggregatedData.length - 1][0];
  return [selectableDateStart, selectableDateEnd];
};
