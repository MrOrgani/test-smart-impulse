export const getBuildings = async () => {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/projects`);
  const data = await res.json();
  return data;
};

export const getEneryConsumptionByBuildingId = async (
  buildingId: string | undefined
) => {
  if (!buildingId) {
    return [];
  }
  const res = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/energy?uuid=${buildingId}`
  );
  const data = await res.json();
  return data;
};
