import { IBuilding } from "@/lib/types";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useProjects = () => {
  const [buildings, setBuildings] = useState<IBuilding[]>([]);
  const location = useLocation();

  const getCurrentBuilding = () => {
    return buildings.find(
      (buildings) => buildings.uuid === location.pathname.split("/")[1]
    );
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/projects`)
      .then((res) => res.json())
      .then((result) => {
        setBuildings(result);
      });
  }, []);
  return {
    buildings,
    getCurrentBuilding,
    currentBuilding: getCurrentBuilding(),
  };
};
