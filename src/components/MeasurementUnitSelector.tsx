import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { useDataParams } from "@/context/DataParamsProvider";

const measurementUnitOptions = [
  { label: "MWh", value: "MWh" },
  { label: "kWh", value: "kWh" },
  { label: "€", value: "euros" },
];

interface Props {
  options?: typeof measurementUnitOptions;
}

export const MeasurementUnitSelector: React.FC<Props> = ({
  options = measurementUnitOptions,
}) => {
  const {
    measureUnitParams: { measureUnit, setMaesureUnit },
  } = useDataParams();
  return (
    <Select
      defaultValue={measureUnit}
      value={measureUnit}
      onValueChange={(value) => setMaesureUnit(value)}
    >
      <SelectTrigger
        id="temporalAggragtion"
        className={
          "w-auto  m-0 p-0 border-0 rounded-none border-b-2 h-auto mx-2"
        }
      >
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ label, value }) => (
          <SelectItem key={label} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
