import React from "react";
import { useSearchParams } from "react-router-dom";

export const useSimilarDateRange = () => {
  const [params, setURLSearchParams] = useSearchParams();

  const similarDateRange = params.get("similarDateRange");
  const setSimilarDateRange = (value: boolean | string) => {
    const searchAsObject: { [key: string]: string } = Object.fromEntries(
      new URLSearchParams(params)
    );

    setURLSearchParams({
      ...searchAsObject,
      similarDateRange: `${value}`,
    });
  };
  return [similarDateRange, setSimilarDateRange] as const;
};
