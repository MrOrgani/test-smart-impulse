import React from "react";
import { useDataContext } from "@/context/DataValueProvider";
import { getValueModifier } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export const AmountSpentWidget = () => {
  const { data, isLoading } = useDataContext();

  const totalAmountSpent = data.datasets
    ?.find((dataset) => dataset.label === "Energie totale")
    ?.tooltip.reduce((acc, value) => acc + value[1], 0);

  const valueModifier = getValueModifier("euros");
  const amount = valueModifier(totalAmountSpent!).toFixed(2);

  if (isLoading || !totalAmountSpent) {
    return <Skeleton className="w-24 h-6" />;
  }

  return <span className=" text-lg font-semibold">€ {amount}</span>;
};
