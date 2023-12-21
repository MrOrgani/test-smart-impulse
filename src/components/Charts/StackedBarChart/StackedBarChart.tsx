import React from 'react';
import type { TooltipItem } from 'chart.js';
import { Chart as ChartJS, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import type { ChartProps } from 'react-chartjs-2';
import { Chart } from 'react-chartjs-2';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useDataFormatterWebWorker from '@/hooks/useDataFormatterWebWorker';
import { useMeasureUnit } from '@/hooks/useMeasureUnit';
import { useTemporalAggregation } from '@/hooks/useTemporalAggregation';
import { useEnergyConsumption, useProjects } from '@/lib/react-query/queries';
import type { ArrayElement } from '@/lib/types';
import { formatDate } from '@/utils/formatDate';
import { getValueModifier } from '@/utils/getValueModifier';

import { stackedBarChartFormatter } from './utils';

ChartJS.register(...registerables, zoomPlugin);

export const StackedBarChart: React.FC = () => {
  const { currentBuilding } = useProjects();
  const { data: datasets, isLoading } = useEnergyConsumption(
    currentBuilding?.uuid,
  );

  const { basicDatasets: aggregatedDatasets, isLoading: webWorkerLoading } =
    useDataFormatterWebWorker({
      datasets,
    });

  const [selectedTemporalAggregation] = useTemporalAggregation();
  const [measureUnit] = useMeasureUnit();

  const valueModifier = getValueModifier(measureUnit);
  const formattedDatasets = stackedBarChartFormatter(
    aggregatedDatasets,
    valueModifier,
  );

  const labels = datasets?.[0]?.data.map((d) => d[0]) ?? [];

  const [showLegend, setShowLegend] = React.useState(false);

  return (
    <div className="lg:flex">
      <div className="w-[730px] p-2 h-[400px]">
        {isLoading || webWorkerLoading ? (
          <Skeleton className="w-full h-[360px] mt-2" />
        ) : (
          <Chart
            data={{
              datasets: formattedDatasets,
              labels,
            }}
            type="bar"
            options={{
              plugins: {
                legend: {
                  position: 'right',
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
                    mode: 'x',
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
                      context: TooltipItem<'bar'> & {
                        dataset: ArrayElement<
                          ChartProps<'bar', number[]>['data']['datasets']
                        > & {
                          tooltip: number[];
                        };
                      },
                    ) {
                      let label = context.dataset.label ?? '';
                      if (label !== '') {
                        label += ': ';
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
                        labels?.[value as number],
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
        size={'sm'}
        className="mt-auto"
      >
        {showLegend ? 'Hide legend' : 'Show legend'}
      </Button>
    </div>
  );
};
