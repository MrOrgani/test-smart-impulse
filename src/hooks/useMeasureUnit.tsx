import { MeasureUnit } from "@/lib/types";
import React from "react";
import { useSearchParams } from "react-router-dom";

export const useMeasureUnit = () => {
  const [params, setURLSearchParams] = useSearchParams();

  const measureUnit = (params.get("measureUnit") as MeasureUnit) ?? "MWh";
  const setMeasureUnit = (selectedMeasureUnit: MeasureUnit) => {
    const searchAsObject: { [key: string]: string } = Object.fromEntries(
      new URLSearchParams(params)
    );

    setURLSearchParams({
      ...searchAsObject,
      measureUnit: selectedMeasureUnit,
    });
  };
  return [measureUnit, setMeasureUnit] as const;
};
