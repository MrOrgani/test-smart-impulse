import React from "react";
import { useSearchParams } from "react-router-dom";

export const useSimilarDateRange = (): readonly [
  string | null,
  (value: boolean | string) => void,
] => {
  const [params, setURLSearchParams] = useSearchParams();

  const similarDateRange = params.get("similarDateRange");
  const setSimilarDateRange = (value: boolean | string): void => {
    const searchAsObject: Record<string, string> = Object.fromEntries(
      new URLSearchParams(params),
    );

    setURLSearchParams({
      ...searchAsObject,
      similarDateRange: `${value}`,
    });
  };
  return [similarDateRange, setSimilarDateRange] as const;
};
