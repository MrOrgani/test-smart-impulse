import { useEnergyConsumption } from "@/hooks/useEnergyData";
import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { applyDateRangeFilter, getTimeLabels } from "@/lib/utils";
import { ChartProps } from "react-chartjs-2";
import { EnergyConsumptionData } from "@/lib/types";
import { DateRange } from "react-day-picker";
import { useProjects } from "@/hooks/useProjects";

const DataContext = React.createContext<{
  data: any | null;
  setDateRangeFilter: (dateRange: DateRange | undefined) => void;
}>({
  data: null,
  setDateRangeFilter: () => {},
});

export const DataContextProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const { currentBuilding } = useProjects();
  const fetchedData = useEnergyConsumption(currentBuilding?.uuid);

  const [dataRangeFilter, setDateRangeFilter] = useState<DateRange | undefined>(
    undefined
  );

  if (!fetchedData.length) {
    return null;
  }

  const handleDateRangeSelection = (dateRange: DateRange | undefined): void => {
    if (!dateRange || !dateRange?.from || !dateRange?.to) {
      return;
    }
    setDateRangeFilter(dateRange);
  };

  const labels = getTimeLabels(fetchedData);

  const formatedDatasets = applyDateRangeFilter(fetchedData, dataRangeFilter);

  return (
    <DataContext.Provider
      value={{
        data: {
          labels,
          datasets: formatedDatasets,
        },
        setDateRangeFilter: handleDateRangeSelection,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const { data, setDateRangeFilter } = React.useContext(DataContext);
  return { data, setDateRangeFilter };
};
