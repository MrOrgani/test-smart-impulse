import React from "react";
import { formatDatasets } from "@/utils/utils";
import { getTimeLabels } from "@/utils/getTimeLabels";
import { DateRange } from "react-day-picker";
import * as d3 from "d3";
import dayjs from "dayjs";
import { useEnergyConsumption, useProjects } from "@/lib/react-query/queries";
import { useTemporalAggregation } from "@/hooks/useTemporalAggregation";
import { useDateRange } from "@/hooks/useDateRange";
import { BasicFormattedDatasets } from "@/lib/types";

const DataContext = React.createContext<{
  data: { datasets: BasicFormattedDatasets; labels: string[] };
  selectableDateRange: DateRange | undefined;
  isLoading: boolean;
}>({
  data: { datasets: [], labels: [] },
  selectableDateRange: undefined,
  isLoading: true,
});

export const DataValueProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const { currentBuilding } = useProjects();
  const { data: fetchedData, ...restFetchedData } = useEnergyConsumption(
    currentBuilding?.uuid,
  );
  const [selectedTemporalAggregation] = useTemporalAggregation();
  const [selectedDateRange] = useDateRange();

  const labels = getTimeLabels(
    fetchedData ?? [],
    selectedTemporalAggregation,
    currentBuilding?.timezone ?? "Europe/Paris",
  );

  const basicDatasets = formatDatasets(
    fetchedData ?? [],
    selectedDateRange,
    selectedTemporalAggregation,
    currentBuilding?.timezone ?? "Europe/Paris",
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
          datasets: basicDatasets,
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
