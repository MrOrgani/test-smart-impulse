import { useProjects } from "@/lib/react-query/queries";
import { MeasureUnitLabels, TemporalAggregations } from "@/lib/types";
import React from "react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

const DataParamsContext = React.createContext<{
  temporalAggregation: {
    selectedTemporalAggregation: TemporalAggregations;
    setSelectedTemporalAggregation: (
      temporalAggregation: TemporalAggregations
    ) => void;
  };
  dateRangeFilter: {
    selectedDateRange: DateRange | undefined;
    setDateRangeFilter: (dateRange: DateRange | undefined) => void;
  };
  handleDateRangeSelection: (dateRange: DateRange | undefined) => void;
  measureUnitParams: {
    measureUnit: keyof MeasureUnitLabels;
    setMaesureUnit: (measure: keyof MeasureUnitLabels) => void;
  };
}>({
  temporalAggregation: {
    selectedTemporalAggregation: "day",
    setSelectedTemporalAggregation: () => {},
  },
  dateRangeFilter: {
    selectedDateRange: undefined,
    setDateRangeFilter: () => null,
  },
  handleDateRangeSelection: () => null,
  measureUnitParams: {
    measureUnit: "MWh",
    setMaesureUnit: () => null,
  },
});

export const DataParamsProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const [selectedDateRange, setDateRangeFilter] = useState<
    DateRange | undefined
  >(undefined);
  const [selectedTemporalAggregation, setSelectedTemporalAggregation] =
    useState<TemporalAggregations>("day");
  const [measureUnit, setMaesureUnit] =
    useState<keyof MeasureUnitLabels>("MWh");

  const { currentBuilding } = useProjects();

  // Reset date range filter when building changes, we might want to keep current values
  useEffect(() => {
    setDateRangeFilter(undefined);
  }, [currentBuilding?.uuid]);

  return (
    <DataParamsContext.Provider
      value={{
        temporalAggregation: {
          selectedTemporalAggregation,
          setSelectedTemporalAggregation,
        },
        dateRangeFilter: { selectedDateRange, setDateRangeFilter },
        handleDateRangeSelection: (dateRange: DateRange | undefined) =>
          setDateRangeFilter(dateRange),
        measureUnitParams: { measureUnit, setMaesureUnit },
      }}
    >
      {children}
    </DataParamsContext.Provider>
  );
};

export const useDataParams = () => {
  const {
    temporalAggregation,
    dateRangeFilter,
    handleDateRangeSelection,
    measureUnitParams,
  } = React.useContext(DataParamsContext);
  return {
    temporalAggregation,
    dateRangeFilter,
    handleDateRangeSelection,
    measureUnitParams,
  };
};
