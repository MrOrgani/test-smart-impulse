import { useEffect } from 'react';
import { DateRange } from 'react-day-picker';

import { useProjects } from '@/lib/react-query/queries';
import { FetchedDataSet } from '@/lib/types';
import { IWorkerRequest, IWorkerResult } from '@/utils/formatScript';
import { getExtendedDateFromDatasets } from '@/utils/getExtendedDateFromDatasets';

import { useDateRange } from './useDateRange';
import { useTemporalAggregation } from './useTemporalAggregation';
import { useWebWorker } from './useWebWorker';

interface IProps {
  fetchedData: FetchedDataSet[];
}

const workerInstance = new Worker(
  new URL('../utils/formatScript.ts', import.meta.url),
  {
    type: 'module',
  },
);

const useDataFormatterWebWorker = ({ fetchedData }: IProps) => {
  const { currentBuilding } = useProjects();
  const [selectedTemporalAggregation] = useTemporalAggregation();
  const [selectedDateRange] = useDateRange();

  const {
    result: { basicDatasets, buildingId: currentDataBuildingId } = {},
    startProcessing,
  } = useWebWorker<IWorkerResult, IWorkerRequest>(workerInstance);

  useEffect(() => {
    if (!fetchedData?.length) return;
    const [from, to] = selectedDateRange?.split('_') ?? [];

    const [selectableDateStart, selectableDateEnd] =
      getExtendedDateFromDatasets(fetchedData);

    startProcessing({
      datasets: fetchedData,
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
    fetchedData,
    selectedTemporalAggregation,
    selectedDateRange,
    currentBuilding?.timezone,
    startProcessing,
    currentBuilding?.uuid,
  ]);

  return {
    isLoading:
      fetchedData.length > 0 && currentBuilding?.uuid !== currentDataBuildingId,
    basicDatasets: basicDatasets ?? [],
  };
};

export default useDataFormatterWebWorker;
