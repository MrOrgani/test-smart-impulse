import React from "react";
import { formatDatasets, getTimeLabels } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import * as d3 from "d3";
import dayjs from "dayjs";
import { useEnergyConsumption, useProjects } from "@/lib/react-query/queries";
import { useDataParams } from "@/context/DataParamsProvider";

const DataContext = React.createContext<{
  data: any | null;
  setDateRangeFilter: (dateRange: DateRange | undefined) => void;
  selectedDateRange: DateRange | undefined;
  selectableDateRange: DateRange | undefined;
  // temporalAggregation: [
  //   selectedTemporalAggregation: TemporalAggregations,
  //   setSelectedTemporalAggregation: React.Dispatch<
  //     React.SetStateAction<TemporalAggregations>
  //   >
  // ];
  isLoading: boolean;
}>({
  data: null,
  setDateRangeFilter: () => {},
  selectedDateRange: undefined,
  selectableDateRange: undefined,
  // temporalAggregation: ["day", () => {}],
  isLoading: true,
});

export const DataContextProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const { currentBuilding } = useProjects();
  const { data: fetchedData, ...restFetchedData } = useEnergyConsumption(
    currentBuilding?.uuid
  );
  const {
    temporalAggregation: {
      selectedTemporalAggregation,
      // setSelectedTemporalAggregation,
    },
    dateRangeFilter,
  } = useDataParams();

  const labels = getTimeLabels(
    fetchedData ?? [],
    selectedTemporalAggregation,
    currentBuilding?.timezone ?? "Europe/Paris"
  );

  const formatedDatasets = formatDatasets(
    fetchedData ?? [],
    dateRangeFilter.selectedDateRange,
    selectedTemporalAggregation,
    currentBuilding?.timezone ?? "Europe/Paris"
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
        // temporalAggregation: [
        //   selectedTemporalAggregation,
        //   setSelectedTemporalAggregation,
        // ],
        ...restFetchedData,
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
    ...rest
    // temporalAggregation,
  } = React.useContext(DataContext);
  return {
    data,
    setDateRangeFilter,
    selectedDateRange,
    selectableDateRange,
    ...rest,
    // temporalAggregation,
  };
};
