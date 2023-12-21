import React from 'react';

import { useTemporalAggregation } from '@/hooks/useTemporalAggregation';
import { useEnergyConsumption, useProjects } from '@/lib/react-query/queries';
import { formatDate } from '@/utils/formatDate';
import { getValueModifier } from '@/utils/getValueModifier';

import { CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export const MostExpensiveTemporalAggregationPerCategory = () => {
  const { currentBuilding } = useProjects();
  const { data: datasets, isLoading } = useEnergyConsumption(
    currentBuilding?.uuid,
  );
  const [temporalAggregation] = useTemporalAggregation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 text-xs gap-3">
        {new Array(5).fill(null).map((_, index) => {
          return (
            <React.Fragment key={index}>
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-20 h-4" />
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  const mostExpensiveTemporalPeriod = datasets?.map((dataset) => {
    // get the highest value for each category
    const highestValue = dataset.data.reduce(
      (acc, curr) => (acc[1] > curr[1] ? acc : curr),
      [0, 0],
    );

    return {
      ...dataset,
      data: highestValue,
    };
  });

  const valueModifier = getValueModifier('euros');

  return (
    <>
      <CardTitle className="items-baseline text-xs text-gray-500">
        Most expensive {temporalAggregation} per category
      </CardTitle>
      <div className="grid grid-cols-3 text-xs">
        {mostExpensiveTemporalPeriod &&
        mostExpensiveTemporalPeriod?.length > 0 ? (
          mostExpensiveTemporalPeriod.map((dataset) => {
            return (
              <React.Fragment key={dataset.label}>
                <span
                  className={` underline	`}
                  style={{
                    textDecorationColor: dataset.color,
                  }}
                >
                  {dataset.label}:
                </span>
                <span className="font-semibold text-end self-center	">
                  {formatDate(dataset.data[0], temporalAggregation)}
                </span>
                <span className="font-semibold text-end self-center whitespace-nowrap	">
                  (€ {valueModifier(dataset.data[1]).toFixed(2)})
                </span>
              </React.Fragment>
            );
          })
        ) : (
          <React.Fragment key={'no category'}>
            <span className={` underline	`}>{'no category'}:</span>
            <span className="font-semibold text-end self-center	"></span>
            <span className="font-semibold text-end self-center whitespace-nowrap	">
              (€ {valueModifier(0).toFixed(2)})
            </span>
          </React.Fragment>
        )}
      </div>
    </>
  );
};
