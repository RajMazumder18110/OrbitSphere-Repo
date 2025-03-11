/** @notice library imports */
import { FaMemory } from "react-icons/fa";
import { TbClockPlay } from "react-icons/tb";
import { BsFillCpuFill } from "react-icons/bs";
import { IoLogoUsd, IoMdGlobe } from "react-icons/io";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { LuCalendarClock, LuServer, LuServerOff } from "react-icons/lu";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
/// Local imports
import Breadcrumbs from "@/components/Breadcrumbs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RadialChart from "./RefundChart";
import UtilizationChart from "./UtilizationChart";
import {
  capitalize,
  getCompletionPercentage,
  getDegree,
  getTimeRemaining,
} from "@/lib/utils";
import { getInstancesById, getUtilizationData } from "@/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/// Type
interface SingleInstanceDetailsProps {
  params: Promise<{
    instanceId: string;
  }>;
}

const SingleInstanceDetails = async ({
  params,
}: SingleInstanceDetailsProps) => {
  const { instanceId } = await params;
  /// Grabbing data from database
  const instance = await getInstancesById(instanceId);

  /** @notice Incase if instance not found with id */
  if (!instance) {
    return (
      <div className="w-full flex flex-col gap-10 font-[family-name:var(--font-geist-mono)]">
        <div className="flex gap-7">
          <Breadcrumbs />
        </div>
        <div className="h-[75vh] flex flex-col items-center justify-center gap-5">
          <LuServerOff className="text-5xl" />
          <div className="flex flex-col gap-2 items-center justify-center">
            <h1 className="text-xl font-semibold text-muted-foreground">
              No instance found
            </h1>
            <h1 className="text-3xl font-semibold">{instanceId}</h1>
          </div>
          <Link href={"/dashboard"}>
            <Button
              className="dark text-lg cursor-pointer underline underline-offset-4"
              variant="link"
            >
              Back
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  /// Calculating data
  const isTerminated = instance.status === "TERMINATED";
  const completedPercentage = getCompletionPercentage(
    instance.rentedOn,
    instance.willBeEndOn
  );

  const refundAmount = 1.5; // USDC

  const utilizationData = await getUtilizationData();

  return (
    <div className="w-full flex flex-col gap-10">
      <div className="flex flex-col gap-7">
        <Breadcrumbs />
        <header className="flex gap-3 items-center">
          <h1 className="text-3xl font-semibold font-[family-name:var(--font-geist-mono)]">
            &gt; {instanceId}
          </h1>
          <MdOutlineRadioButtonChecked
            className={`${
              isTerminated ? "text-red-500" : "text-green-500"
            } text-lg`}
          />
        </header>

        <section className="w-full flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <LuCalendarClock className="text-2xl" />
            <h1>{instance.willBeEndOn.toString()}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="text-xs font-semibold dark rounded-full">
              {completedPercentage}%
            </Badge>
            <Progress value={completedPercentage} className="w-full h-4 dark" />
          </div>
        </section>
      </div>

      <section className="dark grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-[family-name:var(--font-geist-mono)]">
        <Card className="gap-1">
          <CardHeader className="flex flex-col items-center gap-3">
            <MdOutlineRadioButtonChecked className="text-2xl" />
            <div className="flex flex-col gap-1 items-center">
              <CardTitle>Status</CardTitle>
              <CardDescription>{capitalize(instance.status)}</CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="gap-1">
          <CardHeader className="flex flex-col items-center gap-3">
            <IoLogoUsd className="text-2xl" />
            <div className="flex flex-col gap-1 items-center">
              <CardTitle>Consumed</CardTitle>
              <CardDescription>
                {instance.totalCost - refundAmount} USDC
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="gap-1">
          <CardHeader className="flex flex-col items-center gap-3">
            <TbClockPlay className="text-2xl" />
            <div className="flex flex-col gap-1 items-center">
              <CardTitle>Remaining</CardTitle>
              <CardDescription>
                {getTimeRemaining(instance.willBeEndOn)}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="gap-1">
          <CardHeader className="flex flex-col items-center gap-3">
            <FaLocationCrosshairs className="text-2xl" />
            <div className="flex flex-col gap-1 items-center">
              <CardTitle>Region</CardTitle>
              <CardDescription>
                {capitalize(instance.region.name)}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="gap-1">
          <CardHeader className="flex flex-col items-center gap-3">
            <IoMdGlobe className="text-2xl" />
            <div className="flex flex-col gap-1 items-center">
              <CardTitle>Sphere</CardTitle>
              <CardDescription>{instance.id}</CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="gap-1">
          <CardHeader className="flex flex-col items-center gap-3">
            <LuServer className="text-2xl" />
            <div className="flex flex-col gap-1 items-center">
              <CardTitle>Type</CardTitle>
              <CardDescription>{instance.instanceType}</CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="gap-1">
          <CardHeader className="flex flex-col items-center gap-3">
            <BsFillCpuFill className="text-2xl" />
            <div className="flex flex-col gap-1 items-center">
              <CardTitle>vCPUs</CardTitle>
              <CardDescription>{instance.sphere.noOfCPUs}</CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="gap-1">
          <CardHeader className="flex flex-col items-center gap-2">
            <FaMemory className="text-2xl" />
            <div className="flex flex-col gap-1 items-center">
              <CardTitle>Memory</CardTitle>
              <CardDescription>{instance.sphere.memoryGBs} GiB</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </section>

      <section className="dark grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
        <RadialChart
          value={refundAmount}
          circleFillDeg={getDegree(refundAmount, instance.totalCost)}
        />
        <UtilizationChart data={utilizationData} />
      </section>
    </div>
  );
};

export default SingleInstanceDetails;
