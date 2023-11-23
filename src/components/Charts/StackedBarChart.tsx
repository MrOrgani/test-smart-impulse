import { useDataContext } from "@/context/DataValueProvider";
import { Chart as ChartJS, registerables } from "chart.js";
import { Chart } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import * as dayjs from "dayjs";
import { useProjects } from "@/lib/react-query/queries";
import { useDataParams } from "@/context/DataParamsProvider";
import { Skeleton } from "../ui/skeleton";

ChartJS.register(...registerables, zoomPlugin);

export const StackedBarChart = () => {
  const { currentBuilding } = useProjects();
  const { data, isLoading } = useDataContext();
  const {
    temporalAggregation: { selectedTemporalAggregation },
  } = useDataParams();

  return (
    <div>
      {isLoading || data.labels.length === 0 ? (
        <Skeleton className="w-full h-[360px] mt-2" />
      ) : (
        <Chart
          className="mt-2"
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
                    const date = dayjs(context[0].label).tz(
                      currentBuilding?.timezone
                    );
                    switch (selectedTemporalAggregation) {
                      case "day":
                        return date.format("DD/MM/YYYY");
                      case "week":
                        return `w${date.week()} / ${date.format("YYYY")}`;
                      case "month":
                        return date.format("MM/YYYY");
                      case "year":
                        return date.format("YYYY");
                    }
                  },
                  label: function (context) {
                    let label = context.dataset.label || "";
                    if (label) {
                      label += ": ";
                    }
                    if (context.parsed.x !== null) {
                      label +=
                        context.dataset.tooltip[context.parsed.x] + " MWh";
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
                    const date = dayjs(data?.labels?.[value]).tz(
                      currentBuilding?.timezone
                    );

                    switch (selectedTemporalAggregation) {
                      case "day":
                        return date.format("DD/MM/YYYY");
                      case "week":
                        return `w${date.week()} / ${date.format("YYYY")}`;
                      case "month":
                        return date.format("MM/YYYY");
                      case "year":
                        return date.format("YYYY");
                    }
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
      )}
    </div>
  );
};
