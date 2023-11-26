import React from "react";
import { useProjects } from "@/lib/react-query/queries";
import dayjs from "dayjs";
import type { DateRange } from "react-day-picker";
import { useSearchParams } from "react-router-dom";

export const useDateRange = (): readonly [
  DateRange | undefined,
  (selectedDateRange: DateRange) => void,
] => {
  const [params, setURLSearchParams] = useSearchParams();
  const { currentBuilding } = useProjects();

  const dateRangeFromUrl = params
    .get("dateRange")
    ?.split("_")
    .map((d) =>
      dayjs(d)
        .tz(currentBuilding?.timezone)
        .toDate(),
    );

  const dateRange =
    dateRangeFromUrl?.every((d) => dayjs(d).isValid()) ?? false
      ? { from: dateRangeFromUrl?.[0], to: dateRangeFromUrl?.[1] }
      : undefined;

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
          selectedDateRange?.from?.toISOString() ?? ""
        }_${selectedDateRange?.to?.toISOString()}`,
      ),
    });
  };
  return [dateRange, setDateRangeFilter] as const;
};
