import React from "react";
import { useDataContext } from "@/context/DataValueProvider";
import { getValueModifier } from "@/utils/getValueModifier";
import { Skeleton } from "../ui/skeleton";

export const AmountSpentWidget: React.FC = () => {
  const { data, isLoading } = useDataContext();

  if (isLoading) {
    return <Skeleton className="w-24 h-6" />;
  }

  const totalAmountSpent = data.datasets
    ?.find((dataset) => dataset.label === "Energie totale")
    ?.tooltip.reduce((acc, value) => acc + value[1], 0);

  if (totalAmountSpent === undefined) {
    return null;
  }

  const valueModifier = getValueModifier("euros");
  const amount = valueModifier(totalAmountSpent).toFixed(2);

  return (
    <div className="grid grid-cols-2">
      <span className={`text-xs font-semibold `}>Total</span>
      <span className=" text-md font-semibold text-end">€ {amount}</span>
    </div>
  );
};
