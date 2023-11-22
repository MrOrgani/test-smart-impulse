import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange, DayPicker } from "react-day-picker";

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
  range: [number, number];
};

export const DatePickerWithRange: React.FC<DatePickerProps> = ({
  className,
  range,
  onChange,
}) => {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: dayjs(range[0]).toDate(),
    to: dayjs(range[1]).toDate(),
  });

  React.useEffect(() => {
    setDateRange({
      from: dayjs(range[0]).toDate(),
      to: dayjs(range[1]).toDate(),
    });
  }, [range]);

  const disabledDays = {
    before: dayjs(range[0]).toDate(),
    after: dayjs(range[1]).toDate(),
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
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
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
