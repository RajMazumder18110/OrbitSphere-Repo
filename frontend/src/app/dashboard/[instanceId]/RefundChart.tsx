"use client";
/** @notice Library imports */
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { useEffect, useState } from "react";
import { InstanceStatus } from "@orbitsphere/database/schemas";
/// Local imports
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { calculateRefundAmount, getDegree, IInstance } from "@/lib/utils";
import { formatUnits } from "viem";

export default function RadialChartChart({
  instance,
}: {
  instance: IInstance;
}) {
  const [refundAmount, setRefundAmount] = useState(360);
  const chartData = [{ browser: "safari", usdc: refundAmount, fill: "white" }];

  const chartConfig = {
    usdc: {
      label: "USDC",
    },
    safari: {
      label: "Safari",
      color: "white",
    },
  } satisfies ChartConfig;

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
    <Card className="dark w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>
          USDC {instance.status === "TERMINATED" ? "Refunded" : "Refund"}
        </CardTitle>
        <CardDescription>
          {instance.status === "TERMINATED"
            ? "The USDC refund has been processed on-chain."
            : "Upon terminating your sphere, you will receive a refund in USDC."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={getDegree(
              refundAmount,
              Number(formatUnits(instance.totalCost, 6))
            )}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="usdc" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-gray-200 text-4xl font-bold"
                        >
                          {chartData[0].usdc.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground font-bold"
                        >
                          USDC
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
