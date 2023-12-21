import React from 'react';

import { useMeasureUnit } from '@/hooks/useMeasureUnit';
import type { MeasureUnit } from '@/lib/types';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const measurementUnitOptions = { MWh: 'MWh', kWh: 'kWh', euros: '€' };

interface Props {
  options?: Array<[string, MeasureUnit]>;
}

export const MeasurementUnitSelector: React.FC<Props> = ({
  options = Object.entries(measurementUnitOptions),
}) => {
  const [measureUnit, setMeasureUnit] = useMeasureUnit();

  return (
    <Select
      defaultValue={measureUnit}
      value={measureUnit}
      onValueChange={(value: MeasureUnit) => {
        setMeasureUnit(value);
      }}
    >
      <SelectTrigger
        className={
          'w-auto  m-0 p-0 border-0 rounded-none border-b-2 h-auto mx-2'
        }
      >
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {options.map(([key, value]) => (
          <SelectItem key={key} value={key}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
