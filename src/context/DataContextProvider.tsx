import { useEnergyConsumption } from "@/hooks/useEnergyData";
import React, { useEffect, useState } from "react";
import { formatDatasets, getTimeLabels } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { useProjects } from "@/hooks/useProjects";
import * as d3 from "d3";
import dayjs from "dayjs";

const DataContext = React.createContext<{
  data: any | null;
  setDateRangeFilter: (dateRange: DateRange | undefined) => void;
  selectedDateRange: DateRange | undefined;
  selectableDateRange: DateRange | undefined;
  temporalAggregation: {
    selectedTemporalAggregation: "day" | "week" | "month" | "year";
    setSelectedTemporalAggregation: React.Dispatch<
      React.SetStateAction<"day" | "week" | "month" | "year">
    >;
  };
}>({
  data: null,
  setDateRangeFilter: () => {},
  selectedDateRange: undefined,
  selectableDateRange: undefined,
  temporalAggregation: {
    selectedTemporalAggregation: "day",
    setSelectedTemporalAggregation: () => {},
  },
});

export const DataContextProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const { currentBuilding } = useProjects();
  const [, fetchedData] = useEnergyConsumption(currentBuilding?.uuid);

  const [selecteDdateRange, setDateRangeFilter] = useState<
    DateRange | undefined
  >(undefined);
  const [selectedTemporalAggregation, setSelectedTemporalAggregation] =
    useState<"day" | "week" | "month" | "year">("day");

  // Reset date range filter when building changes, we might want to keep current values
  useEffect(() => {
    setDateRangeFilter(undefined);
  }, [currentBuilding?.uuid]);

  // if (![fetchedData]?.length) {
  if (!fetchedData) {
    return null;
  }

  const handleDateRangeSelection = (dateRange: DateRange | undefined): void => {
    setDateRangeFilter(dateRange);
  };

  const labels = getTimeLabels([fetchedData], selectedTemporalAggregation);
  console.log("fetchedData", fetchedData, labels);

  const formatedDatasets = formatDatasets([fetchedData], selecteDdateRange);

  const selectableDateExtendArray = d3.extent(labels as number[]);

  const selectableDateRange = {
    from: dayjs(selectableDateExtendArray[0]).toDate(),
    to: dayjs(selectableDateExtendArray[1]).toDate(),
  };

  return (
    <DataContext.Provider
      value={{
        data: {
          labels,
          datasets: formatedDatasets,
        },
        selectedDateRange: selecteDdateRange || selectableDateRange,
        selectableDateRange,
        setDateRangeFilter: handleDateRangeSelection,
        temporalAggregation: {
          selectedTemporalAggregation,
          setSelectedTemporalAggregation,
        },
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const {
    data,
    setDateRangeFilter,
    selectedDateRange,
    selectableDateRange,
    temporalAggregation,
  } = React.useContext(DataContext);
  return {
    data,
    setDateRangeFilter,
    selectedDateRange,
    selectableDateRange,
    temporalAggregation,
  };
};
