import React from 'react';

import useDataFormatterWebWorker from '@/hooks/useDataFormatterWebWorker';
import type { AggregatedDataset } from '@/lib/types';

const DataContext = React.createContext<{
  data: AggregatedDataset[];
  isLoading: boolean;
}>({
  data: [],
  isLoading: true,
});

export const DataValueProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const { aggregatedDatasets, isLoading } = useDataFormatterWebWorker();

  return (
    <DataContext.Provider value={{ data: aggregatedDatasets, isLoading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const value = React.useContext(DataContext);
  return value;
};
