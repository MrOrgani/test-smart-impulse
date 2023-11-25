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

  return (
    <div className="grid grid-cols-2">
      <span className={`text-xs font-semibold `}>Total</span>
      <span className=" text-md font-semibold text-end">€ {amount}</span>
    </div>
  );
};
