import { type ClassValue, clsx } from 'clsx';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { twMerge } from 'tailwind-merge';

dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
