"use client";
/** @notice Library imports */
import { useState } from "react";
import { format } from "date-fns";
import { CalendarClock } from "lucide-react";
import { UseFormSetValue } from "react-hook-form";
/// Local imports
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { LaunchInstanceSchema } from "@/schemas";

export function DateTimePicker({
  date,
  setValue,
}: {
  date: Date;
  setValue: UseFormSetValue<LaunchInstanceSchema>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const today = new Date();
  // Generate minutes, ensuring at least 10 minutes after the current time
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
  // Generate hours starting from the current hour
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleDateSelect = (selectedDate?: Date) => {
    if (selectedDate) {
      // @ts-ignore
      setValue("terminateOn", selectedDate);
    }
  };

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    if (date) {
      const newDate = new Date(date);
      if (type === "hour") {
        newDate.setHours(parseInt(value));
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      }
      // @ts-ignore
      setValue("terminateOn", newDate);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "dark w-full justify-start text-left font-normal cursor-pointer",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarClock className="mr-2 h-4 w-4 dark" />
          {date ? (
            format(date, "MM/dd/yyyy hh:mm")
          ) : (
            <span>MM/DD/YYYY hh:mm</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 dark">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            fromDate={today}
          />
          <div className="dark flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      date && date.getHours() === hour ? "default" : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {String(hour).padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {minutes.map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      date && date.getMinutes() === minute ? "default" : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
