import React, { useMemo } from 'react';

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

  const value = useMemo(() => {
    return {
      data: aggregatedDatasets ?? [],
      isLoading,
    };
  }, [aggregatedDatasets, isLoading]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => {
  const { data, ...rest } = React.useContext(DataContext);
  return {
    data,
    ...rest,
  };
};
