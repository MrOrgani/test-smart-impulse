import React from "react";
import { DatePickerWithRange } from "./DateRangePicker";
import { useDataParams } from "@/context/DataParamsProvider";
import { useDataContext } from "@/context/DataValueProvider";

export const DateSelector = () => {
  const {
    dateRangeFilter: { selectedDateRange },
  } = useDataParams();
  const { setDateRangeFilter, selectableDateRange } = useDataContext();

  return (
    <DatePickerWithRange
      selectableDateRange={selectableDateRange}
      selectedDateRange={selectedDateRange || selectableDateRange}
      onChange={setDateRangeFilter}
    />
  );
};
