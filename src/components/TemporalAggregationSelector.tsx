import React from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useTemporalAggregation } from "@/hooks/useTemporalAggregation";
import type { TemporalAggregations } from "@/lib/types";

export const TemporalAggregationSelector: React.FC = () => {
  const [selectedTemporalAggregation, setSelectedTemporalAggregation] =
    useTemporalAggregation();
  return (
    <div className="flex items-center">
      <Label htmlFor="temporalAggragtion" className="font-normal ml-auto">
        <span>aggregated by</span>
      </Label>
      <Select
        defaultValue={selectedTemporalAggregation}
        value={selectedTemporalAggregation}
        onValueChange={(value: TemporalAggregations) => {
          setSelectedTemporalAggregation(value);
        }}
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
          <SelectItem value="day">day</SelectItem>
          <SelectItem value="week">week</SelectItem>
          <SelectItem value="month">month</SelectItem>
          <SelectItem value="year">year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
