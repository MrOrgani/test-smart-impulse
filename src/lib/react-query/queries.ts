import { useLocation } from 'react-router-dom';

import { getBuildings, getEneryConsumptionByBuildingId } from '@/api';
import type { FetchedDataset, IBuilding } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const useProjects = () => {
  const location = useLocation();

  const buildings = useQuery<IBuilding[]>({
    queryKey: ['buildings'],
    queryFn: () => getBuildings(),
  });

  const getCurrentBuilding = () => {
    return buildings.data?.find(
      (buildings) => buildings.uuid === location.pathname.split('/')[1],
    );
  };

  return {
    ...buildings,
    getCurrentBuilding,
    currentBuilding: getCurrentBuilding(),
  };
};

export const useEnergyConsumption = (uuid: string | undefined) => {
  return useQuery<FetchedDataset[]>({
    queryKey: ['building-energy-consumption', uuid],
    queryFn: () => getEneryConsumptionByBuildingId(uuid),
  });
};
