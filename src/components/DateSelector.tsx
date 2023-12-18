import React from 'react';
import { DatePickerWithRange } from './DateRangePicker';
import { useDataContext } from '@/context/DataValueProvider';
import { useDateRange } from '@/hooks/useDateRange';
import { useTemporalAggregation } from '@/hooks/useTemporalAggregation';
import { useProjects } from '@/lib/react-query/queries';
import { DateRange } from 'react-day-picker';
import * as d3 from 'd3';

export const DateSelector = () => {
  const [selectedDateRangeAsString, setDateRangeFilter] = useDateRange();
  const [temporalAggregation] = useTemporalAggregation();
  const { data: fetchedData, isLoading } = useDataContext();
  const { currentBuilding } = useProjects();

  const [from, to] = selectedDateRangeAsString?.split('_') ?? [];

  // get the longest data array property in the fetchedData array
  const longestDataArray = fetchedData.reduce((acc, curr) => {
    return curr.data.length > acc.data.length ? curr : acc;
  }, fetchedData[0]);
  const [selectableFrom, selectableTo] = longestDataArray?.data
    ? d3.extent(longestDataArray?.data, (d) => d[0])
    : [];

  const selectedDateRange = selectedDateRangeAsString
    ? ({
        from: new Date(from),
        to: new Date(to),
      } as DateRange)
    : selectableFrom && selectableTo
      ? { from: new Date(selectableFrom), to: new Date(selectableTo) }
      : undefined;

  return (
    <DatePickerWithRange
      selectableDateRange={
        selectableFrom && selectableTo
          ? { from: new Date(selectableFrom), to: new Date(selectableTo) }
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
