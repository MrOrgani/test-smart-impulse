import { EnergyConsumptionData } from "@/lib/types";
import { useState, useEffect } from "react";

export const useEnergyConsumption = (uuid: string | undefined) => {
  const [data, setData] = useState<EnergyConsumptionData>([]);

  useEffect(() => {
    if (!uuid) {
      return;
    }
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/energy?uuid=${uuid}`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      });
  }, [uuid]);

  return data;
};
