import React from "react";
import { TemporalAggregations } from "@/lib/types";
import { useSearchParams } from "react-router-dom";

export const useTemporalAggregation = () => {
  const [params, setURLSearchParams] = useSearchParams();

  // TEMPORAL AGGREGATION
  const selectedTemporalAggregation =
    (params.get("temporalAggregation") as TemporalAggregations) ?? "day";
  const setSelectedTemporalAggregation = (
    selectedTemporalAggregation: TemporalAggregations
  ) => {
    const searchAsObject: { [key: string]: string } = Object.fromEntries(
      new URLSearchParams(params)
    );
    setURLSearchParams({
      ...searchAsObject,
      temporalAggregation: selectedTemporalAggregation,
    });
  };

  return [selectedTemporalAggregation, setSelectedTemporalAggregation] as const;
};
