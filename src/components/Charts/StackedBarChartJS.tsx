import { useDataContext } from "@/context/DataContextProvider";
import { Chart as ChartJS, registerables } from "chart.js";
import { Chart } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import { useProjects } from "@/hooks/useProjects";
import * as dayjs from "dayjs";
import { DatePickerWithRange } from "../DateRangePicker";
import { ResetButton } from "../ResetButton";
import { TemporalAggregationSelector } from "../TemporalAggregationSelector";

ChartJS.register(...registerables, zoomPlugin);

export const StackedBarChartJS = () => {
  const { currentBuilding } = useProjects();
  const { data, setDateRangeFilter, selectedDateRange, selectableDateRange } =
    useDataContext();

  if (!data?.labels?.length) {
    return null;
  }

  return (
    <div>
      {!!selectableDateRange && (
        <div className="flex justify-between">
          <DatePickerWithRange
            selectableDateRange={selectableDateRange}
            onChange={setDateRangeFilter}
            selectedDateRange={selectedDateRange}
          />
          <TemporalAggregationSelector />
          <ResetButton />
        </div>
      )}
      <Chart
        type="bar"
        options={{
          plugins: {
            legend: {
              position: "bottom",
            },
            zoom: {
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: "x",
              },
            },
            title: {
              display: true,
              text: `Consommation ${currentBuilding?.name}`,
            },
            tooltip: {
              callbacks: {
                title: function (context) {
                  return dayjs(data?.labels?.[context[0].dataIndex]).format(
                    "DD/MM/YYYY"
                  );
                },
                label: function (context) {
                  let label = context.dataset.label || "";
                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed.x !== null) {
                    label += context.dataset.tooltip[context.parsed.x] + " MWh";
                  }
                  return label;
                },
              },
            },
          },
          responsive: true,
          scales: {
            x: {
              stacked: true,
              ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, ticks) {
                  // display labels depending on the selected temporal aggregation
                  return dayjs(data?.labels?.[index]).format("DD/MM/YYYY");
                },
              },
            },
            y: {
              stacked: true,
              ticks: {
                callback: function (value, index, values) {
                  // This function will be called for each tick
                  return value + " Mwh"; // Replace this with your own logic
                },
              },
            },
          },
        }}
        data={data}
      />
    </div>
  );
};
