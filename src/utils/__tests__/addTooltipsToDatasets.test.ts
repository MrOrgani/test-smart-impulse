import { addTooltipsToDatasets } from "../addTooltipsToDatasets";
import type { EnergyConsumptionDataset } from "@/lib/types";

describe("addTooltipsToDatasets", () => {
  it("should format energy consumption datasets correctly", () => {
    const data: EnergyConsumptionDataset[] = [
      {
        type: "total",
        label: "Energie totale",
        color: "#FF0000",
        data: [
          [1625097600, 100],
          [1625184000, 200],
          [1625270400, 150],
        ],
      },
      {
        type: "element",
        label: "Autres CVC",
        color: "#FFFF00",
        data: [
          [1625097600, 50],
          [1625184000, 100],
          [1625270400, 75],
        ],
      },
    ];

    const expected = [
      {
        datasetType: "element",
        label: "Autres CVC",
        backgroundColor: "#FFFF00",
        data: [
          [1625097600, 50],
          [1625184000, 100],
          [1625270400, 75],
        ],
        tooltip: [
          [1625097600, 50],
          [1625184000, 100],
          [1625270400, 75],
        ],
      },
      {
        datasetType: "total",
        label: "Energie totale",
        backgroundColor: "#FF0000",
        data: [
          [1625097600, 100],
          [1625184000, 200],
          [1625270400, 150],
        ],
        tooltip: [
          [1625097600, 100],
          [1625184000, 200],
          [1625270400, 150],
        ],
      },
    ];

    const result = addTooltipsToDatasets(data);

    expect(result).toEqual(expected);
  });

  it("should return an empty array if the input data is empty", () => {
    const data: EnergyConsumptionDataset[] = [];

    const result = addTooltipsToDatasets(data);

    expect(result).toEqual([]);
  });
});
