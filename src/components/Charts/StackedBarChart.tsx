import { useDataContext } from "@/context/DataValueProvider";
import { Chart as ChartJS, registerables } from "chart.js";
import { Chart } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import { useProjects } from "@/lib/react-query/queries";
import { Skeleton } from "../ui/skeleton";
import { useTemporalAggregation } from "@/hooks/useTemporalAggregation";
import { useMeasureUnit } from "@/hooks/useMeasureUnit";
import { formatDate } from "@/lib/utils";

ChartJS.register(...registerables, zoomPlugin);

export const StackedBarChart = () => {
  const { currentBuilding } = useProjects();
  const { data, isLoading } = useDataContext();

  const [selectedTemporalAggregation] = useTemporalAggregation();
  const [measureUnit] = useMeasureUnit();

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
                text: `Energy consumption for ${currentBuilding?.name}`,
              },
              tooltip: {
                callbacks: {
                  title: function (context) {
                    return formatDate(
                      context[0].label,
                      selectedTemporalAggregation,
                      currentBuilding?.timezone
                    );
                  },
                  label: function (context) {
                    let label = context.dataset.label || "";
                    if (label) {
                      label += ": ";
                    }
                    if (context.parsed.x !== null) {
                      label += `${
                        context.dataset.tooltip[context.parsed.x]
                      } ${measureUnit}`;
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
                  callback: function (value, index, ticks) {
                    return formatDate(
                      data?.labels?.[value],
                      selectedTemporalAggregation,
                      currentBuilding?.timezone
                    );
                  },
                },
              },
              y: {
                stacked: true,
                ticks: {
                  callback: function (value, index, values) {
                    return `${value} ${measureUnit}`;
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
