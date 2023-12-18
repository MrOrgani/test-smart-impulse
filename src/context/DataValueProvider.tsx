import React, { useMemo } from 'react';

import { useEnergyConsumption, useProjects } from '@/lib/react-query/queries';
import type { FetchedDataSet } from '@/lib/types';

const DataContext = React.createContext<{
  data: FetchedDataSet[];
  isLoading: boolean;
  isFetching: boolean;
}>({
  data: [],
  isLoading: true,
  isFetching: true,
});

export const DataValueProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const { currentBuilding } = useProjects();
  const { data: fetchedData, ...restFetchedData } = useEnergyConsumption(
    currentBuilding?.uuid,
  );

  const value = useMemo(() => {
    return {
      data: fetchedData ?? [],
      ...restFetchedData,
      isLoading:
        restFetchedData.isLoading ||
        restFetchedData.isFetching ||
        !currentBuilding,
    };
  }, [currentBuilding, fetchedData, restFetchedData]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => {
  const { data, ...rest } = React.useContext(DataContext);
  return {
    data,
    ...rest,
  };
};
