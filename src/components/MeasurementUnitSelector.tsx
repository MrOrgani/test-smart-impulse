import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { useDataParams } from "@/context/DataParamsProvider";
import { MeasureUnit } from "@/lib/types";

const measurementUnitOptions = { MWh: "MWh", kWh: "kWh", euros: "€" };

interface Props {
  options?: [string, MeasureUnit][];
}

export const MeasurementUnitSelector: React.FC<Props> = ({
  options = Object.entries(measurementUnitOptions),
}) => {
  const {
    measureUnitParams: { measureUnit, setMaesureUnit },
  } = useDataParams();
  return (
    <Select
      defaultValue={measureUnit}
      value={measureUnit}
      onValueChange={(value: MeasureUnit) => setMaesureUnit(value)}
    >
      <SelectTrigger
        className={
          "w-auto  m-0 p-0 border-0 rounded-none border-b-2 h-auto mx-2"
        }
      >
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {options.map(([label, value]) => (
          <SelectItem key={label} value={label}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
