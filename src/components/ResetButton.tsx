import React from 'react';
import { RotateCw } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import { Button } from './ui/button';

export const ResetButton: React.FC = () => {
  const [, setURLSearchParams] = useSearchParams();

  return (
    <Button
      variant={'outline'}
      aria-label="Reset date range filter"
      className="bg-white p-1 lg:ml-auto"
      onClick={() => {
        setURLSearchParams({
          measureUnit: 'MWh',
          temporalAggregation: 'day',
        });
      }}
    >
      <RotateCw />
    </Button>
  );
};
