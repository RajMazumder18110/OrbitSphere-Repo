"use client";
/** @notice Library imports */
import { formatUnits } from "viem";
import { IoLogoUsd } from "react-icons/io";
import { useEffect, useState } from "react";
/// Local imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { calculateRefundAmount, IInstance } from "@/lib/utils";

const USDCConsumedCard = ({ instance }: { instance: IInstance }) => {
  const [refundAmount, setRefundAmount] = useState(0);

  const handleFetch = (interval?: NodeJS.Timer) => {
    const p = calculateRefundAmount(instance);
    setRefundAmount(p);

    /// If totaly complete
    if (p === 0) {
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
        <IoLogoUsd className="text-2xl" />
        <div className="flex flex-col gap-1 items-center">
          <CardTitle>Consumed</CardTitle>
          <CardDescription>
            {(
              Number(formatUnits(instance.totalCost, 6)) - refundAmount
            ).toFixed(4)}{" "}
            USDC
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};

export default USDCConsumedCard;
