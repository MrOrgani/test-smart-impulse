type EnergyConsumptionStackedLabel =
  | 'Informatique et onduleurs'
  | 'Moteurs triphasés sur variateurs'
  | 'Éclairage'
  | 'Équipements CVC et autres moteurs'
  | 'Groupes froid'
  | 'Energie totale'
  | 'CTA sur variateur'
  | 'Escalators'
  | 'Éclairage Parking'
  | 'Éclairage centre commercial'
  | 'Groupes froids, pompes et autres moteurs';

type EnergyConsumptionElementLabel =
  | 'Autres CVC'
  | 'Production chaud/froid'
  | 'Ventilation (CTA)'
  | 'Informatique'
  | 'Autres éclairages'
  | 'Éclairage sur ballast électronique'
  | 'Lampes fluocompactes';

export type FetchedDataSet = {
  color: string;
  data: Array<[EpochTimeStamp, number]>;
} & (
  | {
      label: EnergyConsumptionStackedLabel;
      type: 'stacked';
    }
  | {
      label: EnergyConsumptionElementLabel;
      type: 'element';
    }
  | {
      label: 'Energie totale';
      type: 'total';
    }
);

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends ReadonlyArray<infer ElementType> ? ElementType : never;

export interface IBuilding {
  name: string;
  timezone: string;
  uuid: string;
}

export type TemporalAggregations = 'day' | 'week' | 'month' | 'year';

export interface IBuiding {
  uuid: string;
  name: string;
  timezone: string;
}

export type MeasureUnit = 'MWh' | 'kWh' | 'euros';
export type MeasureUnitLabels = {
  [key in MeasureUnit]: string;
};

export type BasicFormattedDataset = {
  datasetType: FetchedDataSet['type'];
  data: FetchedDataSet['data'];
  label: FetchedDataSet['label'];
  backgroundColor: FetchedDataSet['color'];
};

export type AggregatedDataset = {
  datasetType: FetchedDataSet['type'];
  data: [string, number][];
  label: FetchedDataSet['label'];
  backgroundColor: FetchedDataSet['color'];
};
