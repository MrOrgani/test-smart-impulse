import { ChartProps } from "react-chartjs-2";

type EnergyConsumptionStackedLabel =
  | "Informatique et onduleurs"
  | "Moteurs triphasés sur variateurs"
  | "Éclairage"
  | "Équipements CVC et autres moteurs"
  | "Groupes froid"
  | "Energie totale"
  | "CTA sur variateur"
  | "Escalators"
  | "Éclairage Parking"
  | "Éclairage centre commercial"
  | "Groupes froids, pompes et autres moteurs";

type EnergyConsumptionElementLabel =
  | "Autres CVC"
  | "Production chaud/froid"
  | "Ventilation (CTA)"
  | "Informatique"
  | "Autres éclairages"
  | "Éclairage sur ballast électronique"
  | "Lampes fluocompactes";

type FetchedDataSet = {
  color: string;
  data: Array<[EpochTimeStamp, number]>;
} & (
  | {
      label: EnergyConsumptionStackedLabel;
      type: "stacked";
    }
  | {
      label: EnergyConsumptionElementLabel;
      type: "element";
    }
  | {
      label: "Energie totale";
      type: "total";
    }
);

export type EnergyConsumptionDatasets = FetchedDataSet[];

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends ReadonlyArray<infer ElementType> ? ElementType : never;

export type EnergyConsumptionDataset = ArrayElement<EnergyConsumptionDatasets>;

export interface IBuilding {
  name: string;
  timezone: string;
  uuid: string;
}

export type TemporalAggregations = "day" | "week" | "month" | "year";

export interface IBuiding {
  uuid: string;
  name: string;
  timezone: string;
}

export type MeasureUnit = "MWh" | "kWh" | "euros";
export type MeasureUnitLabels = {
  [key in MeasureUnit]: string;
};

export type BasicFormattedDatasets = Array<{
  datasetType: EnergyConsumptionDataset["type"];
  data: EnergyConsumptionDataset["data"];
  tooltip: EnergyConsumptionDataset["data"];
  label: EnergyConsumptionDataset["label"];
  backgroundColor: EnergyConsumptionDataset["color"];
}>;
