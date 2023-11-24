import React from "react";
import { formatDatasets, getTimeLabels } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import * as d3 from "d3";
import dayjs from "dayjs";
import { useEnergyConsumption, useProjects } from "@/lib/react-query/queries";
import { useTemporalAggregation } from "@/hooks/useTemporalAggregation";
import { useMeasureUnit } from "@/hooks/useMeasureUnit";
import { useDateRange } from "@/hooks/useDateRange";

const DataContext = React.createContext<{
  data: any | null;
  selectableDateRange: DateRange | undefined;
  isLoading: boolean;
}>({
  data: null,
  selectableDateRange: undefined,
  isLoading: true,
});

export const DataValueProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const { currentBuilding } = useProjects();
  const { data: fetchedData, ...restFetchedData } = useEnergyConsumption(
    currentBuilding?.uuid
  );
  const [selectedTemporalAggregation] = useTemporalAggregation();
  const [measureUnit] = useMeasureUnit();
  const [selectedDateRange] = useDateRange();

  const labels = getTimeLabels(
    fetchedData ?? [],
    selectedTemporalAggregation,
    currentBuilding?.timezone ?? "Europe/Paris"
  );

  const formatedDatasets = formatDatasets(
    fetchedData ?? [],
    selectedDateRange,
    selectedTemporalAggregation,
    currentBuilding?.timezone ?? "Europe/Paris",
    measureUnit
  );

  const selectableDateExtendArray = d3.extent(labels);
  const selectableDateRange =
    labels.length > 0
      ? {
          from: dayjs(selectableDateExtendArray[0]).toDate(),
          to: dayjs(selectableDateExtendArray[1]).toDate(),
        }
      : undefined;

  return (
    <DataContext.Provider
      value={{
        data: {
          labels,
          datasets: formatedDatasets,
        },
        selectableDateRange,
        ...restFetchedData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const { data, selectableDateRange, ...rest } = React.useContext(DataContext);
  return {
    data,
    selectableDateRange,
    ...rest,
  };
};
