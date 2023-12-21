import { useEffect } from 'react';
import { DateRange } from 'react-day-picker';

import { useProjects } from '@/lib/react-query/queries';
import { FetchedDataset } from '@/lib/types';
import { IWorkerRequest, IWorkerResult } from '@/utils/formatScript';
import { getExtendedDateFromDatasets } from '@/utils/getExtendedDateFromDatasets';

import { useDateRange } from './useDateRange';
import { useTemporalAggregation } from './useTemporalAggregation';
import { useWebWorker } from './useWebWorker';

interface IProps {
  datasets: FetchedDataset[] | undefined;
}

const workerInstance = new Worker(
  new URL('../utils/formatScript.ts', import.meta.url),
  {
    type: 'module',
  },
);

const useDataFormatterWebWorker = ({ datasets }: IProps) => {
  const { currentBuilding } = useProjects();
  const [selectedTemporalAggregation] = useTemporalAggregation();
  const [selectedDateRange] = useDateRange();

  const {
    result: { basicDatasets, buildingId: currentDataBuildingId } = {},
    startProcessing,
  } = useWebWorker<IWorkerResult, IWorkerRequest>(workerInstance);

  useEffect(() => {
    if (!datasets?.length) return;
    const [from, to] = selectedDateRange?.split('_') ?? [];

    const [selectableDateStart, selectableDateEnd] =
      getExtendedDateFromDatasets(datasets);

    startProcessing({
      datasets: datasets,
      temporalAggregation: selectedTemporalAggregation,
      dateRange: selectedDateRange
        ? ({
            from: new Date(from),
            to: new Date(to),
          } as DateRange)
        : selectableDateStart && selectableDateEnd
          ? {
              from: new Date(selectableDateStart),
              to: new Date(selectableDateEnd),
            }
          : { from: undefined, to: undefined },
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
  ]);

  return {
    isLoading:
      datasets &&
      datasets.length > 0 &&
      currentBuilding?.uuid !== currentDataBuildingId,
    basicDatasets: basicDatasets ?? [],
  };
};

export default useDataFormatterWebWorker;
