import { DateRange } from 'react-day-picker';

import { FetchedDataset } from '@/lib/types';
import { getExtendedDateFromDatasets } from '@/utils/getExtendedDateFromDatasets';

export const getDateRange = ({
  selectedDateRange,
  datasets,
}: {
  selectedDateRange: string | undefined;
  datasets: FetchedDataset[] | undefined;
}): DateRange => {
  const [from, to] = selectedDateRange?.split('_') ?? [];

  const [selectableDateStart, selectableDateEnd] =
    getExtendedDateFromDatasets(datasets);

  if (selectedDateRange)
    return {
      from: new Date(from),
      to: new Date(to),
    };
  else if (selectableDateStart && selectableDateEnd) {
    return {
      from: new Date(selectableDateStart),
      to: new Date(selectableDateEnd),
    };
  }
  return { from: undefined, to: undefined };
};
