import { getBuildings, getEneryConsumptionByBuildingId } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { EnergyConsumptionData, IBuilding } from "@/lib/types";
import { useLocation } from "react-router-dom";

export const useProjects = () => {
  const location = useLocation();

  const buildings = useQuery<IBuilding[]>({
    queryKey: ["buildings"],
    queryFn: () => getBuildings(),
  });

  const getCurrentBuilding = () => {
    return buildings.data?.find(
      (buildings) => buildings.uuid === location.pathname.split("/")[1]
    );
  };

  return {
    ...buildings,
    getCurrentBuilding,
    currentBuilding: getCurrentBuilding(),
  };
};

export const useEnergyConsumption = (uuid: string | undefined) => {
  return useQuery<EnergyConsumptionData>({
    queryKey: ["building-energy-consumption", uuid],
    queryFn: () => getEneryConsumptionByBuildingId(uuid),
  });
};
