import React from 'react';
import { DateRange } from 'react-day-picker';

import { useDataContext } from '@/context/DataValueProvider';
import { useDateRange } from '@/hooks/useDateRange';
import { useTemporalAggregation } from '@/hooks/useTemporalAggregation';
import { useProjects } from '@/lib/react-query/queries';
import { getExtendedDateFromDatasets } from '@/utils/getExtendedDateFromDatasets';

import { DatePickerWithRange } from './DateRangePicker';

export const DateSelector = () => {
  const [selectedDateRangeAsString, setDateRangeFilter] = useDateRange();
  const [temporalAggregation] = useTemporalAggregation();
  const { data: fetchedData, isLoading } = useDataContext();
  const { currentBuilding } = useProjects();

  const [from, to] = selectedDateRangeAsString?.split('_') ?? [];

  // get the longest data array property in the fetchedData array
  const [selectableDateStart, selectableDateEnd] =
    getExtendedDateFromDatasets(fetchedData);
  const selectedDateRange = selectedDateRangeAsString
    ? ({
        from: new Date(from),
        to: new Date(to),
      } as DateRange)
    : selectableDateStart && selectableDateEnd
      ? { from: new Date(selectableDateStart), to: new Date(selectableDateEnd) }
      : undefined;

  return (
    <DatePickerWithRange
      selectableDateRange={
        selectableDateStart && selectableDateEnd
          ? {
              from: new Date(selectableDateStart),
              to: new Date(selectableDateEnd),
            }
          : undefined
      }
      selectedDateRange={selectedDateRange}
      onChange={setDateRangeFilter}
      isLoading={isLoading}
      temporalAggregation={temporalAggregation}
      timezone={currentBuilding?.timezone}
    />
  );
};
