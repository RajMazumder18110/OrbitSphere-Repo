"use client";
/** @notice Library imports */
import { InstanceStatus } from "@orbitsphere/database/schemas";
/// Local imports
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "@/components/ui/tooltip";

const TerminateTime = ({
  status,
  willBeEndOn,
  terminatedOn,
}: {
  willBeEndOn: Date;
  status: InstanceStatus;
  terminatedOn: Date | null;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="cursor-pointer">
          <h1>
            {status === "TERMINATED"
              ? terminatedOn!.toString()
              : willBeEndOn.toString()}
          </h1>
        </TooltipTrigger>
        <TooltipContent className="dark">
          {status === "TERMINATED"
            ? "Sphere was terminated on"
            : "Sphere is scheduled to terminate on"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TerminateTime;
