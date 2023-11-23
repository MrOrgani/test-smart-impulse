import React from "react";
import { Button } from "./ui/button";
import { useDataContext } from "@/context/DataValueProvider";
import { RotateCw } from "lucide-react";

export const ResetButton = () => {
  const { setDateRangeFilter } = useDataContext();
  return (
    <Button
      variant={"outline"}
      aria-label="Reset date range filter"
      className="bg-white ml-auto"
      onClick={() => setDateRangeFilter(undefined)}
    >
      <RotateCw />
    </Button>
  );
};
