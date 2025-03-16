/** @notice library imports */
import Link from "next/link";
import Image from "next/image";
import { FaMemory } from "react-icons/fa";
import { IoGitNetwork } from "react-icons/io5";
import { BsFillCpuFill } from "react-icons/bs";
import { IoMdGlobe } from "react-icons/io";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { LuCalendarClock, LuServer } from "react-icons/lu";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
/// Local imports
import Breadcrumbs from "@/components/Breadcrumbs";
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
import { getUtilizationData } from "@/actions";
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
import Terminate from "./Terminate";
import ServerNotFoundImage from "@/assets/not-found.svg";
import { formatUnits } from "viem";
import InstanceStatus from "./InstanceStatus";
import { getSphereByInstanceIdWithServerAction } from "@/actions/database";
import TimeRemainingProgressbar from "./TimeRemainingProgressbar";
import TimeRemainingCard from "./TimeRemainingCard";
import USDCConsumedCard from "./USDCConsumedCard";
import TerminateTime from "./TerminateTime";

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
  const instance = await getSphereByInstanceIdWithServerAction(instanceId);

  /** @notice Incase if instance not found with id */
  if (!instance) {
    return (
      <div className="w-full flex flex-col gap-10 font-[family-name:var(--font-geist-mono)]">
        <div className="flex gap-7 pt-5">
          <Breadcrumbs />
        </div>
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-10">
          <Image
            src={ServerNotFoundImage}
            alt="Server not found"
            className="w-[35%]"
          />
          <div className="flex flex-col gap-2 items-center justify-center">
            <h1 className="text-xl font-semibold text-muted-foreground">
              Not found
            </h1>
            <h1 className="text-xl md:text-3xl font-semibold">{instanceId}</h1>
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

  return (
    <Dialog>
      <div className="w-full flex flex-col gap-10 mt-3">
        <div className="flex flex-col gap-7">
          <Breadcrumbs />
          <header className="flex justify-between gap-3 items-center">
            <div className="flex gap-3 items-center">
              <h1 className="text-3xl font-semibold font-[family-name:var(--font-geist-mono)]">
                &gt; {instanceId}
              </h1>
              <MdOutlineRadioButtonChecked
                className={`${
                  instance.status === "QUEUED"
                    ? "text-yellow-500 animate-pulse"
                    : isTerminated
                    ? "text-red-500"
                    : "text-green-500 animate-pulse"
                } text-xl`}
              />
            </div>
            {instance.status !== "QUEUED" && !isTerminated && (
              <div className="flex items-center gap-4">
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    type="button"
                    className="cursor-pointer"
                  >
                    Connect
                  </Button>
                </DialogTrigger>
                <Terminate sphereId={instance.sphereId} />
              </div>
            )}
          </header>

          <section className="w-full flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <LuCalendarClock className="text-2xl" />
              <TerminateTime
                status={instance.status}
                willBeEndOn={instance.willBeEndOn}
                terminatedOn={instance.terminatedOn}
              />
              {instance.status === "RUNNING" && (
                <InstanceStatus
                  instanceId={instance.instanceId}
                  region={instance.region.value}
                />
              )}
            </div>
            <TimeRemainingProgressbar instance={instance} />
          </section>
        </div>

        <section className="dark grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-[family-name:var(--font-geist-mono)]">
          <Card className="gap-1">
            <CardHeader className="flex flex-col items-center gap-3">
              <MdOutlineRadioButtonChecked className="text-2xl" />
              <div className="flex flex-col gap-1 items-center">
                <CardTitle>Status</CardTitle>
                <CardDescription>
                  {instance.status === "QUEUED"
                    ? "Terminating"
                    : isTerminated
                    ? "Terminated"
                    : "Running"}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
          <USDCConsumedCard instance={instance} />
          <TimeRemainingCard instance={instance} />
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
                <CardDescription>{instance.sphereId}</CardDescription>
              </div>
            </CardHeader>
          </Card>
          <Card className="gap-1">
            <CardHeader className="flex flex-col items-center gap-3">
              <LuServer className="text-2xl" />
              <div className="flex flex-col gap-1 items-center">
                <CardTitle>Type</CardTitle>
                <CardDescription>{instance.sphere.name}</CardDescription>
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
                  {instance.sphere.memoryGiB} GiB
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </section>

        <section className="dark grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
          <RadialChart
            status={instance.status}
            value={refundAmount}
            circleFillDeg={getDegree(
              refundAmount,
              Number(formatUnits(instance.totalCost, 6))
            )}
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
