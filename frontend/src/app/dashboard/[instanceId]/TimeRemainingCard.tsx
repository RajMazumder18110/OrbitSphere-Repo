"use client";
/** @notice Library imports */
import { useEffect, useState } from "react";
import { TbClockPlay } from "react-icons/tb";
/// Local imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getTimeRemaining, IInstance } from "@/lib/utils";

const TimeRemainingCard = ({ instance }: { instance: IInstance }) => {
  const [timeRemaining, setTimeRemaining] = useState("00:00");

  const handleFetch = (interval?: NodeJS.Timer) => {
    const p = getTimeRemaining(instance);
    setTimeRemaining(p);

    /// If totaly complete
    if (p === "00:00") {
      clearInterval(interval);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timer | undefined;

    /// Initial fetch
    handleFetch();

    ///Start polling every minute
    interval = setInterval(() => handleFetch(interval), 60_000);

    /// Clean up
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="gap-1">
      <CardHeader className="flex flex-col items-center gap-3">
        <TbClockPlay className="text-2xl" />
        <div className="flex flex-col gap-1 items-center">
          <CardTitle>Remaining</CardTitle>
          <CardDescription>{timeRemaining}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};

export default TimeRemainingCard;
