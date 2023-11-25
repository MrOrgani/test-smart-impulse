import React from "react";
import { useDataContext } from "@/context/DataValueProvider";
import { getValueModifier } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export const MostExpensiveCategoryWidget = () => {
  const { data, isLoading } = useDataContext();

  if (isLoading) {
    return <Skeleton className="w-24 h-6" />;
  }

  const reducedDataCategories = data.datasets
    .filter((dataset) => dataset.label !== "Energie totale")
    ?.map((dataset) => ({
      ...dataset,
      data: dataset.data?.reduce((acc, value) => acc + value[1], 0),
    }))
    .sort((a, b) => b.data - a.data);

  console.log("reducedDataCategories", reducedDataCategories);

  const mostExpensiveCategory = reducedDataCategories[0];
  if (isLoading || !mostExpensiveCategory?.data) {
    return <Skeleton className="w-24 h-6" />;
  }
  const amount = getValueModifier("euros")(
    mostExpensiveCategory?.data!
  ).toFixed(2);

  return (
    <div className="flex flex-col">
      <span
        className={`text-lg font-semibold underline  `}
        style={{
          textDecorationColor: mostExpensiveCategory.backgroundColor,
        }}
      >
        {mostExpensiveCategory.label}
      </span>
      <span className="text-lg font-semibold"> € {amount}</span>
    </div>
  );
};
