import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import type { TemporalAggregations } from '../lib/types';

dayjs.extend(utc);
dayjs.extend(timezone);

export const getTimeAggregation = (
  timestamp: EpochTimeStamp,
  aggregationType: TemporalAggregations,
  timezone: string,
) => {
  const date = dayjs(timestamp).tz(timezone);
  const ISODate = date.toISOString();
  const startOfWeekDay = date.startOf('week').toISOString();
  const startOfMonthDay = date.startOf('month').toISOString();
  const startOfYearDay = date.startOf('year').toISOString();

  switch (aggregationType) {
    case 'day':
      return ISODate;
    case 'week':
      return startOfWeekDay;
    case 'month':
      return startOfMonthDay;
    case 'year':
      return startOfYearDay;
  }
};
