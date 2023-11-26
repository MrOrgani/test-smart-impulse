import React from "react";
import type { MeasureUnit } from "@/lib/types";
import { useSearchParams } from "react-router-dom";

export const useMeasureUnit = (): readonly [
  MeasureUnit,
  (selectedMeasureUnit: MeasureUnit) => void,
] => {
  const [params, setURLSearchParams] = useSearchParams();

  const measureUnit = (params.get("measureUnit") as MeasureUnit) ?? "MWh";
  const setMeasureUnit = (selectedMeasureUnit: MeasureUnit): void => {
    const searchAsObject: Record<string, string> = Object.fromEntries(
      new URLSearchParams(params),
    );

    setURLSearchParams({
      ...searchAsObject,
      measureUnit: selectedMeasureUnit,
    });
  };
  return [measureUnit, setMeasureUnit] as const;
};
