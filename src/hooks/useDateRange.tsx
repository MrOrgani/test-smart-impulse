import React from 'react';
import dayjs from 'dayjs';
import type { DateRange } from 'react-day-picker';
import { useSearchParams } from 'react-router-dom';

import { useProjects } from '@/lib/react-query/queries';

export const useDateRange = (): readonly [
  string | undefined,
  (selectedDateRange: DateRange | undefined) => void,
] => {
  const [params, setURLSearchParams] = useSearchParams();
  const { currentBuilding } = useProjects();

  const [from, to] =
    params
      .get('dateRange')
      ?.split('_')
      .filter((d) => dayjs(d).isValid())
      .map((d) =>
        dayjs(d)
          .tz(currentBuilding?.timezone)
          .toISOString(),
      ) ?? [];

  const setDateRangeFilter = (
    selectedDateRange: DateRange | undefined,
  ): void => {
    if (
      selectedDateRange?.from === undefined ||
      selectedDateRange?.to === undefined
    )
      return;

    const searchAsObject: Record<string, string> = Object.fromEntries(
      new URLSearchParams(params),
    );
    setURLSearchParams({
      ...searchAsObject,
      dateRange: encodeURI(
        `${
          selectedDateRange.from.toISOString() ?? ''
        }_${selectedDateRange.to.toISOString()}`,
      ),
    });
  };

  const selectedDateRange = from && to ? `${from}_${to}` : undefined;

  return [selectedDateRange, setDateRangeFilter] as const;
};
