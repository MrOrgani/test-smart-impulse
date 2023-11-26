import React from "react";
import { Button } from "./ui/button";
import { useDataContext } from "@/context/DataValueProvider";
import { RotateCw } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export const ResetButton: React.FC = () => {
  const { selectableDateRange } = useDataContext();
  const [, setURLSearchParams] = useSearchParams();

  return (
    <Button
      variant={"outline"}
      aria-label="Reset date range filter"
      className="bg-white p-1 lg:ml-auto"
      onClick={() => {
        setURLSearchParams({
          dateRange: encodeURI(
            `${
              selectableDateRange?.from?.toISOString() ?? ""
            }_${selectableDateRange?.to?.toISOString()}`,
          ),
          measureUnit: "MWh",
          temporalAggregation: "day",
        });
      }}
    >
      <RotateCw />
    </Button>
  );
};
