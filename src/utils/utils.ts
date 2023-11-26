import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  EnergyConsumptionDatasets,
  BasicFormattedDatasets,
  TemporalAggregations,
} from "../lib/types";
import type { DateRange } from "react-day-picker";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { addTooltipsToDatasets } from "./addTooltipsToDatasets";
import { applyDateRangeFilter } from "./applyDateRangeFilter";
import { aggregateDatasets } from "./aggregateDatasets";

dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export const formatDatasets = (
  data: EnergyConsumptionDatasets,
  dateRange: DateRange | undefined,
  aggregationType: TemporalAggregations,
  timezone: string,
): BasicFormattedDatasets => {
  if (data.length < 1) return [];

  const basicDatasets = addTooltipsToDatasets(data);
  const timeFilteredDatasets = applyDateRangeFilter(basicDatasets, dateRange);
  const aggregatedDatasets = aggregateDatasets(
    timeFilteredDatasets,
    aggregationType,
    timezone,
  );

  return aggregatedDatasets;
};
