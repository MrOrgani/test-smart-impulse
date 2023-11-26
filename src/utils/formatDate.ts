import type { TemporalAggregations } from "../lib/types";
import dayjs from "dayjs";

export const formatDate = (
  date: Date | string | undefined | number,
  selectedTemporalAggregation: TemporalAggregations,
  timezone: string = "Europe/Paris",
): string => {
  if (date === undefined) return "";
  const localDate = dayjs(date).tz(timezone);
  switch (selectedTemporalAggregation) {
    case "day":
      return localDate.format("DD/MM/YYYY");
    case "week":
      return `w${localDate.week()} / ${localDate.format("YYYY")}`;
    case "month":
      return localDate.format("MM/YYYY");
    case "year":
      return localDate.format("YYYY");
  }
};
