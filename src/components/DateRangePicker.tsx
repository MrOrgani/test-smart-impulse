import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";

type DatePickerProps = {
  className?: string;
  date?: Date;
  onChange: (date: DateRange | undefined) => void;
  selectedDateRange: DateRange | undefined;
  selectableDateRange: DateRange | undefined;
};

export const DatePickerWithRange: React.FC<DatePickerProps> = ({
  className,
  selectedDateRange,
  onChange,
  selectableDateRange,
}) => {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const disabledDays = {
    before: dayjs(selectableDateRange?.from).toDate(),
    after: dayjs(selectableDateRange?.to).toDate(),
  };

  if (!selectableDateRange?.from || !selectableDateRange?.to) {
    return null;
  }

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
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDateRange?.from ? (
              selectedDateRange.to ? (
                <>
                  {format(selectedDateRange.from, "LLL dd, y")} -{" "}
                  {format(selectedDateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(selectedDateRange.from, "LLL dd, y")
              )
            ) : (
              "Select date range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selectedDateRange?.from}
            min={selectableDateRange.from.getTime()}
            max={selectableDateRange.to.getTime()}
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
