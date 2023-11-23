import { useProjects } from "@/lib/react-query/queries";
import { TemporalAggregations } from "@/lib/types";
import React from "react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

const DataParamsContext = React.createContext<any>({});

export const DataParamsProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
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

  return (
    <DataParamsContext.Provider
      value={{
        temporalAggregation: {
          selectedTemporalAggregation,
          setSelectedTemporalAggregation,
        },
        dateRangeFilter: { selectedDateRange, setDateRangeFilter },
        handleDateRangeSelection,
      }}
    >
      {children}
    </DataParamsContext.Provider>
  );
};

export const useDataParams = () => {
  const { temporalAggregation, dateRangeFilter, handleDateRangeSelection } =
    React.useContext(DataParamsContext);
  return {
    temporalAggregation,
    dateRangeFilter,
    handleDateRangeSelection,
  };
};
