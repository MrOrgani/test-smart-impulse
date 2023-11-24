import React from "react";
import { useProjects } from "@/lib/react-query/queries";
import dayjs from "dayjs";
import { DateRange } from "react-day-picker";
import { useSearchParams } from "react-router-dom";

export const useDateRange = () => {
  const [params, setURLSearchParams] = useSearchParams();
  const { currentBuilding } = useProjects();

  const dateRangeFromUrl = params
    .get("selectedDateRange")
    ?.split("_")
    .map((d) => dayjs(d).tz(currentBuilding?.timezone).toDate());

  const dateRange = dateRangeFromUrl?.every((d) => dayjs(d).isValid())
    ? { from: dateRangeFromUrl?.[0], to: dateRangeFromUrl?.[1] }
    : undefined;

  const setDateRangeFilter = (selectedDateRange: DateRange | undefined) => {
    if (!selectedDateRange?.from || !selectedDateRange?.to) return;

    const searchAsObject: { [key: string]: string } = Object.fromEntries(
      new URLSearchParams(params)
    );
    setURLSearchParams({
      ...searchAsObject,
      selectedDateRange: encodeURI(
        `${
          selectedDateRange?.from?.toISOString() ?? ""
        }_${selectedDateRange?.to?.toISOString()}`
      ),
    });
  };
  return [dateRange, setDateRangeFilter] as const;
};
