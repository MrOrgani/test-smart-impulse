import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";
import { Skeleton } from "./ui/skeleton";
import { TemporalAggregations } from "@/lib/types";

type DatePickerProps = {
  className?: string;
  date?: Date;
  onChange: (date: DateRange | undefined) => void;
  selectedDateRange: DateRange | undefined;
  selectableDateRange: DateRange | undefined;
  isLoading: boolean;
  temporalAggregation: TemporalAggregations;
  timezone: string | undefined;
};

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
    selectedDateRange
  );

  React.useEffect(() => {
    setDateRange(selectedDateRange);
  }, [selectedDateRange]);

  const disabledDays = {
    before: dayjs(selectableDateRange?.from).toDate(),
    after: dayjs(selectableDateRange?.to).toDate(),
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !selectedDateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-10" />
            {isLoading && <Skeleton className=" w-40 h-4" />}
            {!isLoading && selectedDateRange?.from && selectedDateRange.to ? (
              <>
                {formatDate(dateRange?.from, temporalAggregation, timezone)}-{" "}
                {formatDate(dateRange?.to, temporalAggregation, timezone)}
              </>
            ) : null}
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
    </div>
  );
};
