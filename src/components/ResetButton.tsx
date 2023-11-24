import React from "react";
import { Button } from "./ui/button";
import { useDataContext } from "@/context/DataValueProvider";
import { RotateCw } from "lucide-react";
import { useDateRange } from "@/hooks/useDateRange";

export const ResetButton = () => {
  const [, setDateRangeFilter] = useDateRange();
  const { selectableDateRange } = useDataContext();
  return (
    <Button
      variant={"outline"}
      aria-label="Reset date range filter"
      className="bg-white p-1"
      onClick={() => setDateRangeFilter(selectableDateRange)}
    >
      <RotateCw />
    </Button>
  );
};
