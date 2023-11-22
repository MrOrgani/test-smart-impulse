import React from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useDataContext } from "@/context/DataContextProvider";

export const TemporalAggregationSelector = () => {
  const {
    temporalAggregation: {
      selectedTemporalAggregation,
      setSelectedTemporalAggregation,
    },
  } = useDataContext();
  return (
    <div className="flex items-center">
      <Label htmlFor="temporalAggragtion" className="font-normal w-60">
        <span>Aggregated By</span>
      </Label>
      <Select
        defaultValue={selectedTemporalAggregation}
        onValueChange={(value) => setSelectedTemporalAggregation(value as any)}
      >
        <SelectTrigger id="temporalAggragtion">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Day</SelectItem>
          <SelectItem value="week">Week</SelectItem>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="year">Year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
