"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DatePickerProps {
  selectedDate?: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  setDate: React.Dispatch<React.SetStateAction<any>>;
  disabled: boolean;
}

export function DatePicker(props: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={props.disabled}>
        <button
          className={cn(
            "h-fit transition-all duration-200 ease-in-out",
            "relative w-full justify-start rounded-[5px] border border-checkout-border bg-white text-left",
            open &&
              "border-checkout-border-focus shadow-checkout-border-shadow",
            !props.selectedDate && "text-checkout-secondary-foreground",
          )}
        >
          <div
            className={cn(
              "absolute left-3 top-3.5 text-[0.75rem] text-checkout-secondary-foreground opacity-0 transition-all duration-200 ease-in-out",
              props.selectedDate && "top-1.5 opacity-100",
            )}
          >
            <span>Meeting date</span>
          </div>
          <div
            className={cn(
              "px-3 pb-[0.9rem] pt-[0.9rem] text-sm transition-all duration-200 ease-in-out",
              props.selectedDate && "pb-[0.4rem] pt-[1.4rem]",
            )}
          >
            {props.selectedDate ? (
              format(props.selectedDate, "PPP")
            ) : (
              <span>Meeting date</span>
            )}
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={props.selectedDate}
          onSelect={(selectedDate) => {
            const date = selectedDate?.getDate();
            const month = selectedDate?.getMonth()
              ? selectedDate.getMonth() + 1
              : 1;
            const year = selectedDate?.getFullYear();
            props.setDate({
              date: date!,
              month: month,
              year: year!,
            });
            props.setSelectedDate(selectedDate!);
          }}
          disabled={(date) => date < new Date()}
          onDayClick={() => setOpen(false)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
