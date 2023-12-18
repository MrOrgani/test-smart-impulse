import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/utils/utils';
import { formatDate } from '@/utils/formatDate';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import dayjs from 'dayjs';
import { Skeleton } from './ui/skeleton';
import type { TemporalAggregations } from '@/lib/types';

interface DatePickerProps {
  className?: string;
  date?: Date;
  onChange: (date: DateRange | undefined) => void;
  selectedDateRange: DateRange | undefined;
  selectableDateRange: DateRange | undefined;
  isLoading: boolean;
  temporalAggregation: TemporalAggregations;
  timezone: string | undefined;
}

export const DatePickerWithRange: React.FC<DatePickerProps> = ({
  className,
  selectedDateRange,
  onChange,
  selectableDateRange,
  isLoading,
  temporalAggregation,
  timezone,
}) => {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    selectedDateRange,
  );

  React.useEffect(() => {
    setDateRange(selectedDateRange);
  }, [selectedDateRange]);

  const disabledDays = {
    before: dayjs(selectableDateRange?.from).toDate(),
    after: dayjs(selectableDateRange?.to).toDate(),
  };

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open && !dateRange) {
          setDateRange(selectableDateRange);
          onChange(selectableDateRange);
        }
        if (!open && !dateRange?.to) {
          const sameDaySelection = {
            from: dateRange?.from,
            to: dateRange?.from,
          };
          setDateRange(sameDaySelection);
          onChange(sameDaySelection);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={'outline'}
          className={cn(
            'justify-start text-left font-normal  bg-white border-0 rounded-none border-b-2 h-auto mx-2 py-0 px-0',
            selectedDateRange === undefined && 'text-muted-foreground',
          )}
          disabled={selectedDateRange === undefined}
        >
          <CalendarIcon className="mr-2 h-4 w-10" />
          {isLoading || !selectedDateRange ? (
            <Skeleton className=" w-40 h-4" />
          ) : (
            <>
              {'from '}
              {formatDate(
                dateRange?.from ?? selectableDateRange?.from,
                temporalAggregation,
                timezone,
              )}
              {' to '}
              {formatDate(
                dateRange?.to ?? selectableDateRange?.to,
                temporalAggregation,
                timezone,
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={selectedDateRange?.from}
          min={selectableDateRange?.from?.getTime()}
          max={selectableDateRange?.to?.getTime()}
          selected={dateRange}
          onSelect={(range) => {
            setDateRange(range);
            onChange(range);
          }}
          numberOfMonths={2}
          disabled={disabledDays}
        />
      </PopoverContent>
    </Popover>
  );
};
