import React from 'react';

import { useDataContext } from '@/context/DataValueProvider';
import { getValueModifier } from '@/utils/getValueModifier';

import { Skeleton } from '../ui/skeleton';

export const MostExpensiveCategoryWidget = () => {
  const { data: datasets, isLoading } = useDataContext();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2">
        <Skeleton className="w-24 h-6" />
        <Skeleton className="ml-auto w-24 h-6" />
      </div>
    );
  }

  const reducedDataCategories = datasets
    .filter((dataset) => dataset.label !== 'Energie totale')
    ?.map((dataset) => ({
      ...dataset,
      data: dataset.data?.reduce((acc, value) => acc + value[1], 0),
    }))
    .sort((a, b) => b.data - a.data);

  const mostExpensiveCategory = reducedDataCategories[0];
  const amount = getValueModifier('euros')(
    mostExpensiveCategory?.data ?? 0,
  ).toFixed(2);

  return (
    <div className="grid grid-cols-2">
      <span
        className={`text-xs font-semibold underline  `}
        style={{
          textDecorationColor: mostExpensiveCategory?.color ?? '',
        }}
      >
        {mostExpensiveCategory?.label ?? 'No category'}
      </span>
      <span className="text-md font-semibold text-end"> € {amount}</span>
    </div>
  );
};
