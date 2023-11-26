import React from "react";
import { Building } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Link, useLocation } from "react-router-dom";
import type { IBuiding } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";
import { useSimilarDateRange } from "@/hooks/useSimilarDateRange";
import { SameDateRangeCheckbox } from "./SameDateRangeCheckbox";
import { useDateRange } from "@/hooks/useDateRange";

const ButtonSkeleton: React.FC = () => (
  <Skeleton className="flex items-center w-auto animate-pulse">
    <Button variant={"ghost"} className="w-full justify-start font-normal">
      <div className=" bg-slate-200 h-[24px] w-[24px] mx-1" />
      <div className="bg-slate-200  h-4 w-[200px]" />
    </Button>
  </Skeleton>
);

export const Sidebar: React.FC<{
  buildings: IBuiding[];
  isLoading: boolean;
}> = ({ buildings, isLoading }) => {
  const location = useLocation();

  const [selectedDateRange] = useDateRange();
  const [similarDateRange] = useSimilarDateRange();

  const params = new URLSearchParams(location.search);
  if (["false", null].includes(similarDateRange)) {
    params.delete("dateRange");
  }

  return (
    <div className="space-y-4 py-2">
      <div className="py-2">
        <h2 className="relative px-7 text-lg font-semibold tracking-tight">
          Projects
        </h2>
        <ScrollArea className="px-1">
          <div className="space-y-1 p-2">
            {isLoading &&
              new Array(3).fill(0).map((_, i) => <ButtonSkeleton key={i} />)}
            {!isLoading &&
              buildings?.map((building) => {
                const currentBuilding =
                  location.pathname === "/" + building.uuid;
                return (
                  <Link
                    to={`${building.uuid}?${params.toString()}`}
                    key={`${building.uuid}`}
                  >
                    <Button
                      variant={currentBuilding ? "default" : "ghost"}
                      className="w-full justify-start font-normal"
                    >
                      <Building />
                      {building.name}
                    </Button>
                  </Link>
                );
              })}
          </div>
          {selectedDateRange !== undefined && <SameDateRangeCheckbox />}
        </ScrollArea>
      </div>
    </div>
  );
};
