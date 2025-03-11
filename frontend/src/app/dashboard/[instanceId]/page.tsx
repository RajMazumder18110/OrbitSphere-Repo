/** @notice library imports */
import Link from "next/link";
import { FaMemory } from "react-icons/fa";
import { IoGitNetwork } from "react-icons/io5";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RadialChart from "./RefundChart";
import UtilizationChart from "./UtilizationChart";
import {
  calculateRefundAmount,
  capitalize,
  getCompletionPercentage,
  getDegree,
  getTimeRemaining,
  isInstanceTerminated,
} from "@/lib/utils";
import { getInstancesById, getUtilizationData } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import CopyButton from "@/components/CopyButton";

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

  /// Monitoring data
  const utilizationData = await getUtilizationData();
  /// Calculating data
  const isTerminated = isInstanceTerminated(instance);
  const refundAmount = calculateRefundAmount(instance);
  const completedPercentage = getCompletionPercentage(
    instance.rentedOn,
    instance.willBeEndOn
  );

  return (
    <Dialog>
      <div className="w-full flex flex-col gap-10">
        <div className="flex flex-col gap-7">
          <Breadcrumbs />
          <header className="flex justify-between gap-3 items-center">
            <div className="flex gap-3 items-center">
              <h1 className="text-3xl font-semibold font-[family-name:var(--font-geist-mono)]">
                &gt; {instanceId}
              </h1>
              <MdOutlineRadioButtonChecked
                className={`${
                  isTerminated ? "text-red-500" : "text-green-500"
                } text-xl animate-pulse`}
              />
            </div>
            {!isTerminated && (
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  type="button"
                  className="cursor-pointer"
                >
                  Connect
                </Button>
              </DialogTrigger>
            )}
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
              <Progress
                value={completedPercentage}
                className="w-full h-4 dark"
              />
            </div>
          </section>
        </div>

        <section className="dark grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-[family-name:var(--font-geist-mono)]">
          <Card className="gap-1">
            <CardHeader className="flex flex-col items-center gap-3">
              <MdOutlineRadioButtonChecked className="text-2xl" />
              <div className="flex flex-col gap-1 items-center">
                <CardTitle>Status</CardTitle>
                <CardDescription>
                  {isTerminated ? "Terminated" : "Running"}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
          <Card className="gap-1">
            <CardHeader className="flex flex-col items-center gap-3">
              <IoLogoUsd className="text-2xl" />
              <div className="flex flex-col gap-1 items-center">
                <CardTitle>Consumed</CardTitle>
                <CardDescription>
                  {(instance.totalCost - refundAmount).toFixed(2)} USDC
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
                <CardDescription>
                  {instance.sphere.memoryGBs} GiB
                </CardDescription>
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

      {/* Connect Dialog */}
      {!isTerminated && (
        <DialogContent className="dark border-gray-800 flex flex-col gap-7">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold font-[family-name:var(--font-geist-mono)]">
              Connect your sphere
            </DialogTitle>
            <DialogDescription>
              Follow the steps below to connect securely to your rented server.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full grid grid-cols-2 gap-5">
            {/* Connection ip */}
            <Card className="gap-1">
              <CardHeader className="flex flex-col items-center gap-2">
                <IoGitNetwork className="text-2xl" />
                <div className="flex flex-col gap-1 items-center">
                  <CardTitle className="text-muted-foreground font-semibold">
                    Public IP
                  </CardTitle>
                  <CardDescription className="text-gray-200 font-bold text-lg font-[family-name:var(--font-geist-mono)]">
                    {instance.publicIp}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardFooter className="w-full flex items-center justify-center">
                <CopyButton text={instance.publicIp} />
              </CardFooter>
            </Card>

            <Card className="gap-1">
              <CardHeader className="flex flex-col items-center gap-2">
                <IoGitNetwork className="text-2xl" />
                <div className="flex flex-col gap-1 items-center">
                  <CardTitle className="text-muted-foreground font-semibold">
                    Private IP
                  </CardTitle>
                  <CardDescription className="text-gray-200 font-bold text-lg font-[family-name:var(--font-geist-mono)]">
                    {instance.privateIp}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardFooter className="w-full flex items-center justify-center">
                <CopyButton text={instance.privateIp} />
              </CardFooter>
            </Card>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-muted-foreground">
              Protect your private key by running this command.
            </h1>
            <Card>
              <CardHeader>
                <CardDescription className="flex items-center justify-between text-gray-200 p-0">
                  <code className="font-[family-name:var(--font-geist-mono)]">{`chmod 400 your-key.pem`}</code>
                  <CopyButton text={`chmod 400 your-key.pem`} />
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-muted-foreground">
              Use SSH to connect to your sphere.
            </h1>
            <Card>
              <CardHeader>
                <CardDescription className="flex items-center justify-between text-gray-200 p-0">
                  <code className="font-[family-name:var(--font-geist-mono)]">{`ssh -i your-key.pem ubuntu@${instance.publicIp}`}</code>
                  <CopyButton
                    text={`ssh -i your-key.pem ubuntu@${instance.publicIp}`}
                  />
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default SingleInstanceDetails;
