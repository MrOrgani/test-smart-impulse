import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
