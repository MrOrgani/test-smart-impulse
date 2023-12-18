import * as d3 from 'd3';

import { FetchedDataSet } from '@/lib/types';

export const getExtendedDateFromDatasets = (datasets: FetchedDataSet[]) => {
  const longestDataArray = datasets.reduce((acc, curr) => {
    return curr.data.length > acc.data.length ? curr : acc;
  }, datasets[0]);
  const [selectableFrom, selectableTo] = longestDataArray?.data
    ? d3.extent(longestDataArray?.data, (d) => d[0])
    : [];

  return [selectableFrom, selectableTo];
};
