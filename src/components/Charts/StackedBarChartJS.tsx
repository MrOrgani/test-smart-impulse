import { useDataContext } from "@/context/DataContextProvider";
import { Chart as ChartJS, registerables } from "chart.js";
import { Chart } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import { useProjects } from "@/hooks/useProjects";
import * as d3 from "d3";
import * as dayjs from "dayjs";
import { DatePickerWithRange } from "../DateRangePicker";
import { DateRange } from "react-day-picker";

ChartJS.register(...registerables, zoomPlugin);

export const StackedBarChartJS = () => {
  const { currentBuilding } = useProjects();
  const { data, setDateRangeFilter } = useDataContext();

  if (!data?.labels?.length) {
    return null;
  }
  const [min, max] = d3.extent(data.labels as number[]);

  return (
    <div>
      {!!min && !!max && (
        <DatePickerWithRange range={[min, max]} onChange={setDateRangeFilter} />
      )}
      <Chart
        type="bar"
        options={{
          plugins: {
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
