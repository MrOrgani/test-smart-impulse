import React from 'react';

import { useSimilarDateRange } from '@/hooks/useSimilarDateRange';

import { Checkbox } from './ui/checkbox';

export const SameDateRangeCheckbox = () => {
  const [similarDateRange, setSimilarDateRange] = useSimilarDateRange();

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="similar-date-range"
        defaultChecked={false}
        checked={similarDateRange === 'true'}
        onCheckedChange={(checked) => {
          setSimilarDateRange(checked);
        }}
      />
      <label
        htmlFor="similar-date-range"
        className="text-xs font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Keep the same date range between projects
      </label>
    </div>
  );
};
