"use client";
/** @notice Library imports */
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
/// Local imports
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { UtilizationData } from "@/actions";

export default function UtilizationChart({
  data: chartData,
}: {
  data: UtilizationData[];
}) {
  const chartConfig = {
    percentCpu: {
      label: "CPU",
      color: "white",
    },
    percentMem: {
      label: "Memory",
      color: "white",
    },
  } satisfies ChartConfig;

  return (
    <Card className="dark col-span-2">
      <CardHeader>
        <CardTitle>Memory & CPU Utilization</CardTitle>
        <CardDescription>Last 30 minutes</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="percentCpu" fill="white" radius={8} />
            <Bar dataKey="percentMem" fill="white" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
