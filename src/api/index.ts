import { FetchedDataset } from '@/lib/types';

export const getBuildings = async () => {
  const res = await fetch(
    `${
      import.meta.env.VITE_SERVER_URL ?? 'http://localhost:4000'
    }/api/projects`,
  );
  const data = await res.json();
  return data;
};

export const getEneryConsumptionByBuildingId = async (
  buildingId: string | undefined,
) => {
  if (!buildingId) {
    return [];
  }
  const res = await fetch(
    `${
      import.meta.env.VITE_SERVER_URL ?? 'http://localhost:4000'
    }/api/energy?uuid=${buildingId}`,
  );
  const datasets = (await res.json()) as FetchedDataset[];
  datasets.sort((a) => {
    return a.type === 'total' ? 1 : -1;
  });
  return datasets;
};
