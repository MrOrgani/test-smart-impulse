import type { TemporalAggregations } from "../lib/types";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getDataAggregatedByTimeAggregation = (
  data: Array<[EpochTimeStamp, number]>,
  aggregationType: TemporalAggregations,
  timezone: string,
): Map<string, number> => {
  const temporalFormatMap = new Map<string, number>();
  data.forEach((datum) => {
    if (!Array.isArray(datum)) return datum;
    const [timestamp, value] = datum;
    const date = dayjs(timestamp).tz(timezone);
    const ISODate = date.toISOString();
    const dateValue = temporalFormatMap.get(ISODate);
    const startOfWeekDay = date.startOf("week").toISOString();
    const startOfWeekDayValue = temporalFormatMap.get(startOfWeekDay);
    const startOfMonthDay = date.startOf("month").toISOString();
    const startOfMonthValue = temporalFormatMap.get(startOfMonthDay);
    const startOfYearDay = date.startOf("year").toISOString();
    const startOfYearValue = temporalFormatMap.get(startOfYearDay);

    switch (aggregationType) {
      case "day":
        if (temporalFormatMap.has(ISODate) && dateValue !== undefined) {
          temporalFormatMap.set(ISODate, dateValue + value);
        } else {
          temporalFormatMap.set(ISODate, value);
        }
        break;
      case "week":
        if (
          temporalFormatMap.has(startOfWeekDay) &&
          startOfWeekDayValue !== undefined
        ) {
          temporalFormatMap.set(startOfWeekDay, startOfWeekDayValue + value);
        } else {
          temporalFormatMap.set(startOfWeekDay, value);
        }
        break;
      case "month":
        if (
          temporalFormatMap.has(startOfMonthDay) &&
          startOfMonthValue !== undefined
        ) {
          temporalFormatMap.set(startOfMonthDay, startOfMonthValue + value);
        } else {
          temporalFormatMap.set(startOfMonthDay, value);
        }
        break;
      case "year":
        if (
          temporalFormatMap.has(startOfYearDay) &&
          startOfYearValue !== undefined
        ) {
          temporalFormatMap.set(startOfYearDay, startOfYearValue + value);
        } else {
          temporalFormatMap.set(startOfYearDay, value);
        }
        break;
    }
  });
  return temporalFormatMap;
};
