import { useDataContext } from "@/context/DataValueProvider";
import { Chart as ChartJS, registerables } from "chart.js";
import type { TooltipItem } from "chart.js";
import { Chart } from "react-chartjs-2";
import type { ChartProps } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import { useProjects } from "@/lib/react-query/queries";
import { Skeleton } from "../../ui/skeleton";
import { useTemporalAggregation } from "@/hooks/useTemporalAggregation";
import { useMeasureUnit } from "@/hooks/useMeasureUnit";
import { formatDate } from "@/utils/formatDate";
import { getValueModifier } from "@/utils/getValueModifier";
import { stackedBarChartFormatter } from "./utils";
import React from "react";
import { Button } from "@/components/ui/button";
import type { ArrayElement } from "@/lib/types";

ChartJS.register(...registerables, zoomPlugin);

export const StackedBarChart: React.FC = () => {
  const { currentBuilding } = useProjects();
  const { data, isLoading } = useDataContext();

  const [selectedTemporalAggregation] = useTemporalAggregation();
  const [measureUnit] = useMeasureUnit();

  const valueModifier = getValueModifier(measureUnit);
  const formattedDatasets = stackedBarChartFormatter(
    data.datasets,
    valueModifier,
  );

  const [showLegend, setShowLegend] = React.useState(false);

  return (
    <div className="lg:flex">
      <div className="w-[730px] p-2 h-[400px]">
        {isLoading || data.labels.length === 0 ? (
          <Skeleton className="w-full h-[360px] mt-2" />
        ) : (
          <Chart
            data={{
              datasets: formattedDatasets,
              labels: data.labels,
            }}
            type="bar"
            options={{
              plugins: {
                legend: {
                  position: "right",
                  fullSize: true,
                  display: showLegend,
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
                        currentBuilding?.timezone,
                      );
                    },
                    label: function (
                      context: TooltipItem<"bar"> & {
                        dataset: ArrayElement<
                          ChartProps<"bar", number[]>["data"]["datasets"]
                        > & {
                          tooltip: number[];
                        };
                      },
                    ) {
                      let label = context.dataset.label ?? "";
                      if (label !== "") {
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
                    callback: function (value) {
                      return formatDate(
                        data?.labels?.[value as number],
                        selectedTemporalAggregation,
                        currentBuilding?.timezone,
                      );
                    },
                  },
                },
                y: {
                  stacked: true,
                  ticks: {
                    callback: function (value) {
                      return `${value} ${measureUnit}`;
                    },
                  },
                },
              },
            }}
          />
        )}
      </div>
      <Button
        onClick={() => {
          setShowLegend(!showLegend);
        }}
        size={"sm"}
        className="mt-auto"
      >
        {showLegend ? "Hide legend" : "Show legend"}
      </Button>
    </div>
  );
};
