import React from "react";
import { Button } from "./ui/button";
import { useDataContext } from "@/context/DataValueProvider";

export const ResetButton = () => {
  const { setDateRangeFilter } = useDataContext();
  return (
    <Button variant={"outline"} onClick={() => setDateRangeFilter(undefined)}>
      ResetButton
    </Button>
  );
};
