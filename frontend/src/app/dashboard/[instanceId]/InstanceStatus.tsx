"use client";
/** @notice Library imports */
import { MdError } from "react-icons/md";
import { useEffect, useState } from "react";
import { PiSpinnerBold } from "react-icons/pi";
import { FaCircleCheck } from "react-icons/fa6";
/// Local imports
import { getInstanceStatus } from "@/actions/aws/instanceDetails";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type InstanceStatusProps = {
  region: string;
  instanceId: string;
};

const InstanceStatus = ({ instanceId, region }: InstanceStatusProps) => {
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const checkInstanceStatus = (interval?: NodeJS.Timer) => {
    setIsSuccess(false);
    setIsError(false);

    getInstanceStatus(instanceId, region)
      .then((data) => {
        /// If there is no data
        if (!data) {
          setIsError(true);
        } else if (
          data.InstanceStatus!.Status == "initializing" &&
          data.SystemStatus!.Status == "initializing"
        ) {
          setIsInitializing(true);
        }
        /// If fully checked
        else if (
          data.InstanceStatus!.Status == "ok" &&
          data.SystemStatus!.Status == "ok"
        ) {
          setIsSuccess(true);
          interval ? clearInterval(interval) : undefined;
        }
      })
      .catch((err) => {
        setIsError(true);
      });
  };

  useEffect(() => {
    let interval: NodeJS.Timer | undefined;

    /// Initial fetch
    checkInstanceStatus(interval);

    ///Start polling every 30 seconds
    interval = setInterval(() => checkInstanceStatus(interval), 30_000);

    /// Clean up
    return () => clearInterval(interval);
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="cursor-pointer">
          {isError ? (
            <MdError className="text-red-500 text-xl" />
          ) : isSuccess ? (
            <FaCircleCheck className="text-green-500 text-xl" />
          ) : (
            <PiSpinnerBold className="animate-spin text-xl" />
          )}
        </TooltipTrigger>
        <TooltipContent>
          {isError
            ? "Unable to check"
            : isSuccess
            ? "Ready for use"
            : isInitializing
            ? "Initializing"
            : "Checking"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InstanceStatus;
