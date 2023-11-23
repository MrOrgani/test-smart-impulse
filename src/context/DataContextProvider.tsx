import React from "react";
import { formatDatasets, getTimeLabels } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import * as d3 from "d3";
import dayjs from "dayjs";
import { useEnergyConsumption, useProjects } from "@/lib/react-query/queries";
import { useDataParams } from "@/hooks/useDataParams";
import { TemporalAggregations } from "@/lib/types";

const DataContext = React.createContext<{
  data: any | null;
  setDateRangeFilter: (dateRange: DateRange | undefined) => void;
  selectedDateRange: DateRange | undefined;
  selectableDateRange: DateRange | undefined;
  temporalAggregation: {
    selectedTemporalAggregation: TemporalAggregations;
    setSelectedTemporalAggregation: React.Dispatch<
      React.SetStateAction<TemporalAggregations>
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
  const { data: fetchedData } = useEnergyConsumption(currentBuilding?.uuid);
  const { temporalAggregation, dateRangeFilter } = useDataParams();

  if (!fetchedData?.length || currentBuilding === undefined) {
    return null;
  }

  const labels = getTimeLabels(
    fetchedData,
    temporalAggregation.selectedTemporalAggregation,
    currentBuilding?.timezone
  );

  const formatedDatasets = formatDatasets(
    fetchedData,
    dateRangeFilter.selectedDateRange,
    temporalAggregation.selectedTemporalAggregation,
    currentBuilding.timezone
  );

  const selectableDateExtendArray = d3.extent(labels);
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
        selectedDateRange:
          dateRangeFilter.selectedDateRange || selectableDateRange,
        selectableDateRange,
        setDateRangeFilter: dateRangeFilter.setDateRangeFilter,
        temporalAggregation,
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
