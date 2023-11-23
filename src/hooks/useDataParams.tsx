import { useProjects } from "@/lib/react-query/queries";
import { TemporalAggregations } from "@/lib/types";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

export const useDataParams = () => {
  const [selectedDateRange, setDateRangeFilter] = useState<
    DateRange | undefined
  >(undefined);
  const [selectedTemporalAggregation, setSelectedTemporalAggregation] =
    useState<TemporalAggregations>("day");

  const { currentBuilding } = useProjects();

  // Reset date range filter when building changes, we might want to keep current values
  useEffect(() => {
    setDateRangeFilter(undefined);
  }, [currentBuilding?.uuid]);

  const handleDateRangeSelection = (dateRange: DateRange | undefined): void => {
    setDateRangeFilter(dateRange);
  };

  return {
    temporalAggregation: {
      selectedTemporalAggregation,
      setSelectedTemporalAggregation,
    },
    dateRangeFilter: { selectedDateRange, setDateRangeFilter },
    handleDateRangeSelection,
  };
};
