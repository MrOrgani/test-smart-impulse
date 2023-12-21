import { useEffect, useMemo } from 'react';

import { useEnergyConsumption, useProjects } from '@/lib/react-query/queries';
import { IWorkerRequest, IWorkerResult } from '@/utils/formatScript';

import { getDateRange } from '../utils/getDateRange';

import { useDateRange } from './useDateRange';
import { useTemporalAggregation } from './useTemporalAggregation';
import { useWebWorker } from './useWebWorker';

const useDataFormatterWebWorker = () => {
  const workerInstance = useMemo(
    () =>
      new Worker(new URL('../utils/formatScript.ts', import.meta.url), {
        type: 'module',
      }),
    [],
  );
  const {
    result: { aggregatedDatasets, buildingId: currentDataBuildingId } = {},
    startProcessing,
  } = useWebWorker<IWorkerResult, IWorkerRequest>(workerInstance);

  const { currentBuilding } = useProjects();

  const { data: datasets, isLoading } = useEnergyConsumption(
    currentBuilding?.uuid,
  );
  const [selectedTemporalAggregation] = useTemporalAggregation();
  const [selectedDateRange] = useDateRange();

  const dateRange = useMemo(
    () => getDateRange({ selectedDateRange, datasets }),
    [selectedDateRange, datasets],
  );
  useEffect(() => {
    if (!datasets?.length) return;

    startProcessing({
      datasets,
      temporalAggregation: selectedTemporalAggregation,
      dateRange,
      timezone: currentBuilding?.timezone ?? 'Europe/Paris',
      buildingId: currentBuilding?.uuid ?? '',
    });
  }, [
    datasets,
    selectedTemporalAggregation,
    selectedDateRange,
    currentBuilding?.timezone,
    startProcessing,
    currentBuilding?.uuid,
    dateRange,
  ]);

  return {
    isLoading:
      isLoading ||
      !aggregatedDatasets ||
      currentBuilding?.uuid !== currentDataBuildingId,
    aggregatedDatasets: aggregatedDatasets ?? [],
  };
};

export default useDataFormatterWebWorker;
