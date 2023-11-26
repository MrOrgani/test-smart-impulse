import React from "react";
import { useDataContext } from "@/context/DataValueProvider";
import { formatDate } from "@/utils/formatDate";
import { getValueModifier } from "@/utils/getValueModifier";
import { Skeleton } from "../ui/skeleton";
import { useTemporalAggregation } from "@/hooks/useTemporalAggregation";

export const MostExpensiveTemporalAggregationPerCategory = () => {
  const { data, isLoading } = useDataContext();
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

  const mostExpensiveTemporalPeriod = data.datasets.map((dataset) => {
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

  const valueModifier = getValueModifier("euros");

  return (
    <div className="grid grid-cols-3 text-xs">
      {mostExpensiveTemporalPeriod.map((dataset) => {
        return (
          <React.Fragment key={dataset.label}>
            <span
              className={` underline	`}
              style={{
                textDecorationColor: dataset.backgroundColor,
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
      })}
    </div>
  );
};
