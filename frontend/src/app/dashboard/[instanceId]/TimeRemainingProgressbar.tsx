"use client";
/** @notice Library imports */
import { useEffect, useState } from "react";
/// Local imports
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getCompletionPercentage, IInstance } from "@/lib/utils";

const TimeRemainingProgressbar = ({ instance }: { instance: IInstance }) => {
  const [percentage, setPercentage] = useState(0);

  const handleFetch = (interval?: NodeJS.Timer) => {
    const p = getCompletionPercentage(instance);

    /// If totaly complete
    if (p === 100) {
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
    <div className="flex items-center gap-3">
      <Badge className="text-xs font-semibold dark rounded-full">
        {percentage}%
      </Badge>
      <Progress value={percentage} className="w-full h-4 dark" />
    </div>
  );
};

export default TimeRemainingProgressbar;
