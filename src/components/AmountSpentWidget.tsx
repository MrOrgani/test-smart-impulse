import React from "react";
import { useDataContext } from "@/context/DataValueProvider";
import { getValueModifier } from "@/lib/utils";

export const AmountSpentWidget = () => {
  const { data } = useDataContext();

  const totalAmountSpent = data.datasets
    ?.find((dataset) => dataset.label === "Energie totale")
    ?.tooltip.reduce((acc, value) => acc + value[1], 0);

  console.log(
    data.datasets?.find((dataset) => dataset.label === "Energie totale")
  );
  const valueModifier = getValueModifier("euros");
  const amount = valueModifier(totalAmountSpent!).toFixed(2);

  return <span className=" text-lg font-semibold">€ {amount}</span>;
};
