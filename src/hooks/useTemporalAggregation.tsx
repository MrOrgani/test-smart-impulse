import React from 'react';
import { useSearchParams } from 'react-router-dom';

import type { TemporalAggregations } from '@/lib/types';

export const useTemporalAggregation = (): readonly [
  TemporalAggregations,
  (selectedTemporalAggregation: TemporalAggregations) => void,
] => {
  const [params, setURLSearchParams] = useSearchParams();

  // TEMPORAL AGGREGATION
  const selectedTemporalAggregation =
    (params.get('temporalAggregation') as TemporalAggregations) ?? 'day';
  const setSelectedTemporalAggregation = (
    selectedTemporalAggregation: TemporalAggregations,
  ): void => {
    const searchAsObject: Record<string, string> = Object.fromEntries(
      new URLSearchParams(params),
    );

    setURLSearchParams({
      ...searchAsObject,
      temporalAggregation: selectedTemporalAggregation,
    });
  };

  return [selectedTemporalAggregation, setSelectedTemporalAggregation] as const;
};
