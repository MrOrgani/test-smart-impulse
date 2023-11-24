import React from "react";
import { DatePickerWithRange } from "./DateRangePicker";
import { useDataContext } from "@/context/DataValueProvider";
import { useDateRange } from "@/hooks/useDateRange";
import { useTemporalAggregation } from "@/hooks/useTemporalAggregation";
import { useProjects } from "@/lib/react-query/queries";

export const DateSelector = () => {
  const [selectedDateRange, setDateRangeFilter] = useDateRange();
  const [temporalAggregation] = useTemporalAggregation();
  const { selectableDateRange, isLoading } = useDataContext();
  const { currentBuilding } = useProjects();

  return (
    <DatePickerWithRange
      selectableDateRange={selectableDateRange}
      selectedDateRange={selectedDateRange || selectableDateRange}
      onChange={setDateRangeFilter}
      isLoading={isLoading}
      temporalAggregation={temporalAggregation}
      timezone={currentBuilding?.timezone}
    />
  );
};
