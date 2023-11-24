import React from "react";
import { DatePickerWithRange } from "./DateRangePicker";
import { useDataContext } from "@/context/DataValueProvider";
import { useDateRange } from "@/hooks/useDateRange";

export const DateSelector = () => {
  const [selectedDateRange, setDateRangeFilter] = useDateRange();
  const { selectableDateRange, isLoading } = useDataContext();

  return (
    <DatePickerWithRange
      selectableDateRange={selectableDateRange}
      selectedDateRange={selectedDateRange || selectableDateRange}
      onChange={setDateRangeFilter}
      isLoading={isLoading}
    />
  );
};
