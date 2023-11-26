import type { MeasureUnitLabels } from "../lib/types";

export const getValueModifier = (
  measureUnit: keyof MeasureUnitLabels,
): ((value: number, MWhPrice?: number) => number) => {
  switch (measureUnit) {
    case "MWh":
      return (value: number) => value / 1000000;
    case "kWh":
      return (value: number) => value / 1000;
    case "euros":
      return (value: number, MWhPrice = 83) => (value / 1000000) * MWhPrice;
  }
};
