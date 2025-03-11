/** @notice library imports */
import { FaMemory } from "react-icons/fa";
import { TbClockPlay } from "react-icons/tb";
import { BsFillCpuFill } from "react-icons/bs";
import { IoLogoUsd, IoMdGlobe } from "react-icons/io";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { LuCalendarClock, LuServer } from "react-icons/lu";
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
import { capitalize, getDegree } from "@/lib/utils";
import { getInstancesById, getUtilizationData } from "@/actions";

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

  const timeConsumed = 10; // 10%
  const refundAmount = 30.5; // USDC
  const totalPaid = 80.5;
  const endTime = new Date();

  const instance = await getInstancesById(instanceId);
  const isTerminated = instance.status === "TERMINATED";

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
            <h1>{endTime.toTimeString()}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="text-xs font-semibold dark rounded-full">
              {timeConsumed}%
            </Badge>
            <Progress value={timeConsumed} className="w-full h-4 dark" />
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
              <CardDescription>{totalPaid - refundAmount} USDC</CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="gap-1">
          <CardHeader className="flex flex-col items-center gap-3">
            <TbClockPlay className="text-2xl" />
            <div className="flex flex-col gap-1 items-center">
              <CardTitle>Remaining</CardTitle>
              <CardDescription>00:15:00</CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="gap-1">
          <CardHeader className="flex flex-col items-center gap-3">
            <FaLocationCrosshairs className="text-2xl" />
            <div className="flex flex-col gap-1 items-center">
              <CardTitle>Region</CardTitle>
              <CardDescription>{capitalize(instance.region)}</CardDescription>
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
              <CardDescription>1</CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="gap-1">
          <CardHeader className="flex flex-col items-center gap-2">
            <FaMemory className="text-2xl" />
            <div className="flex flex-col gap-1 items-center">
              <CardTitle>Memory</CardTitle>
              <CardDescription>1 GiB</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </section>

      <section className="dark grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
        <RadialChart
          value={refundAmount}
          circleFillDeg={getDegree(refundAmount, totalPaid)}
        />
        <UtilizationChart data={utilizationData} />
      </section>
    </div>
  );
};

export default SingleInstanceDetails;
