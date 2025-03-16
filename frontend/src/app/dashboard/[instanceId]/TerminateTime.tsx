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
          <h1 className="text-sm md:hidden">
            {status === "TERMINATED"
              ? `${terminatedOn!.toLocaleDateString()} ${terminatedOn!.toTimeString()}`
              : `${willBeEndOn!.toLocaleDateString()} ${willBeEndOn!.toTimeString()}`}
          </h1>
          <h1 className="text-sm hidden md:block md:text-lg">
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
