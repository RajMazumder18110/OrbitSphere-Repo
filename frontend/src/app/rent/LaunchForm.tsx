/** @notice Library imports */
"use client";
import { toast } from "sonner";
import { erc20Abi, formatUnits, Hex } from "viem";
import { useEffect, useRef, useState } from "react";
import { FaCheck, FaRegClock } from "react-icons/fa6";
import { TbServer2 } from "react-icons/tb";
import { RiLoader4Line } from "react-icons/ri";
import { IoRocketSharp } from "react-icons/io5";
import { MdOutlineWallet, MdError } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { IoMdRadioButtonOff, IoMdRadioButtonOn } from "react-icons/io";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from "wagmi";
/// Local imports
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import SSHKeyHolder from "./SSHKeyHolder";
import { IRegion, ISphere } from "@/actions";
import { Button } from "@/components/ui/button";
import GenerateSSHKeyButton from "./GenerateSSHKeyButton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { launchInstanceSchema, LaunchInstanceSchema } from "@/schemas";
import { DateTimePicker } from "@/components/DateTimePicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { minifyAddress } from "@/lib/utils";
import { orbitSphereAbi } from "@/constants/orbitSphereAbi";
import { Skeleton } from "@/components/ui/skeleton";
import { ORBITSPHERE, USDC } from "@/constants";
import Link from "next/link";

/// Type
type ILaunchInstanceFormProps = {
  regions: IRegion[];
  instances: ISphere[];
};

/// Component
const LaunchInstanceForm = ({
  regions,
  instances,
}: ILaunchInstanceFormProps) => {
  const {
    reset,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(launchInstanceSchema),
  });
  const [rentalCost, setRentalCost] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const [isTxnSuccess, setIsTxnSuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTransactionStatus, setCurrentTransactionStatus] = useState("");
  const { isConnected, isConnecting, address } = useAccount();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const { data: usdcBalanceOfUser } = useReadContract({
    address: USDC,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address!],
  });

  useEffect(() => {
    if (isConnected) {
      formRef?.current?.requestSubmit();
    }
  }, [address]);

  const onSubmit = async (params: LaunchInstanceSchema) => {
    try {
      setIsDialogOpen(true);
      setIsTxnSuccess(false);

      /// If user not connected
      if (!isConnected || !publicClient) {
        return toast("Opps! Wallet not connected", {
          description: "Please connect your wallet first",
          className: "dark",
        });
      }

      /// Estimating USDC cost
      const actualCost = await publicClient.readContract({
        abi: orbitSphereAbi,
        address: ORBITSPHERE,
        functionName: "getOrbitSphereInstanceCost",
        args: [params.instance, params.terminateOn],
      });
      setRentalCost(actualCost.toString());

      /// If User don't have balance
      if (usdcBalanceOfUser! < actualCost) {
        setCurrentTransactionStatus("Insufficient funds");
        return toast("Opps! Insufficient funds", {
          description: "😔 You don't have enough balance to rent.",
          className: "dark",
        });
      }

      /// Approving USDC
      let hash: Hex;
      setCurrentTransactionStatus("Requested for approve USDC transaction");
      hash = await writeContractAsync({
        address: USDC,
        abi: erc20Abi,
        account: address,
        functionName: "approve",
        args: [ORBITSPHERE, actualCost],
      });
      /// Waiting for transaction receipt
      setCurrentTransactionStatus("Waiting for approval transaction");
      await publicClient.waitForTransactionReceipt({ hash });

      /// Rent transaction
      setCurrentTransactionStatus("Requested for rent transaction");
      hash = await writeContractAsync({
        account: address,
        address: ORBITSPHERE,
        abi: orbitSphereAbi,
        functionName: "rentOrbitSphereInstance",
        args: [
          params.region,
          params.instance,
          params.terminateOn,
          params.sshPubKey,
        ],
      });

      /// Waiting for transaction receipt
      setCurrentTransactionStatus("Waiting for rent transaction");
      await publicClient.waitForTransactionReceipt({ hash });

      /// After success
      reset();
      setIsTxnSuccess(true);
      setCurrentTransactionStatus("Successfully launched Sphere");
      toast("Congratulations 🎉", {
        description:
          "Successfully initiated a sphere. Wait for instance to boot up. 🔥",
        className: "dark",
      });
    } catch (error: any) {
      setIsDialogOpen(false);
      console.error(error);

      toast("Opps!! Failed to do transaction", {
        description: error.message,
        className: "dark",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen}>
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-10 items-center"
      >
        <header className="flex flex-col gap-2 items-center md:items-start">
          <h1 className="text-2xl font-semibold">
            Create Your{" "}
            <span className="font-[family-name:var(--font-geist-mono)]">
              Sphere
            </span>{" "}
          </h1>
          <p className="text-muted-foreground text-center md:text-start">
            Launch your own cloud instance effortlessly with{" "}
            <span className="text-gray-300 font-semibold">OrbitSphere</span>.
            Choose a region, configure your resources, and generate an SSH key
            for secure access. Pay per hour in USDC and get started instantly
            with decentralized cloud computing!
          </p>
        </header>

        <div className="w-full flex flex-col gap-5 items-center">
          {/* Region */}
          <section className="w-full flex flex-col gap-5 pb-7 border-b gray-border">
            <h1 className="font-medium text-xl font-[family-name:var(--font-geist-mono)]">
              Region
            </h1>
            {errors.region ? (
              <p className="text-red-600">{errors.region.message}</p>
            ) : undefined}
            <Controller
              control={control}
              name="region"
              render={({ field }) => (
                <ScrollArea className="w-full">
                  <div className="w-full flex items-center gap-5">
                    {regions.map((region) => (
                      <Card
                        className="dark w-[13rem] p-4 gap-4 cursor-pointer"
                        key={region.value}
                        // @ts-ignore
                        onClick={
                          region.isEnabled
                            ? () => setValue(field.name, region.value as Hex)
                            : undefined
                        }
                      >
                        {field.value === region.value ? (
                          <IoMdRadioButtonOn className="text-green-400" />
                        ) : (
                          <IoMdRadioButtonOff />
                        )}

                        <CardHeader className="flex items-center justify-center p-0 font-semibold font-[family-name:var(--font-geist-mono)]">
                          {region.name}
                        </CardHeader>
                        <CardFooter className="flex items-center justify-center">
                          <Button
                            className="cursor-pointer w-full"
                            variant="secondary"
                            type="button"
                            disabled={!region.isEnabled}
                          >
                            {!region.isEnabled ? (
                              <FaRegClock className="text-sm" />
                            ) : field.value === region.name ? (
                              <FaCheck />
                            ) : (
                              <TbServer2 />
                            )}{" "}
                            {!region.isEnabled
                              ? "Coming soon"
                              : field.value === region.name
                              ? "Selected"
                              : "Select"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                    <ScrollBar orientation="horizontal" className="hidden" />
                  </div>
                </ScrollArea>
              )}
            />
          </section>

          {/* Instance Type */}
          <section className="w-full flex flex-col gap-5 pb-7 border-b gray-border">
            <h1 className="font-medium text-xl font-[family-name:var(--font-geist-mono)]">
              Sphere
            </h1>
            {errors.instance ? (
              <p className="text-red-600">{errors.instance.message}</p>
            ) : undefined}
            <Controller
              name="instance"
              control={control}
              render={({ field }) => (
                <ScrollArea className="border-none">
                  <div className="w-full flex items-center gap-5">
                    {instances.map((instance) => (
                      <Card
                        className="dark w-[15rem] p-4 gap-3 font-[family-name:var(--font-geist-mono)] cursor-pointer"
                        key={instance.name}
                        // @ts-ignore
                        onClick={
                          instance.isEnabled
                            ? () => setValue(field.name, instance.name as Hex)
                            : undefined
                        }
                      >
                        {field.value === instance.name ? (
                          <IoMdRadioButtonOn className="text-green-400" />
                        ) : (
                          <IoMdRadioButtonOff />
                        )}
                        <CardHeader className="flex items-center justify-center text-lg p-0 font-semibold">
                          {instance.hourlyRate} USDC/hour
                        </CardHeader>
                        <CardDescription className="flex items-center justify-center text-md font-semibold">
                          {instance.name}
                        </CardDescription>
                        <CardContent className="w-full py-2 flex flex-col">
                          <div className="w-full flex items-center justify-between">
                            <h1 className="text-muted-foreground">
                              vCPUs: {instance.noOfCPUs}
                            </h1>
                            <h1 className="text-muted-foreground">
                              GPUs: {instance.noOfGPUs}
                            </h1>
                          </div>
                          <div className="w-full flex items-center justify-between">
                            <h1 className="text-muted-foreground">
                              mGiB: {instance.memoryGBs}
                            </h1>
                            <h1 className="text-muted-foreground">
                              sGiB: {instance.sGiB}
                            </h1>
                          </div>
                        </CardContent>
                        <CardFooter className="flex items-center justify-center">
                          <Button
                            className="cursor-pointer w-full"
                            variant="secondary"
                            type="button"
                            disabled={!instance.isEnabled}
                          >
                            {!instance.isEnabled ? (
                              <FaRegClock className="text-sm" />
                            ) : field.value === instance.name ? (
                              <FaCheck />
                            ) : (
                              <TbServer2 />
                            )}{" "}
                            {!instance.isEnabled
                              ? "Coming soon"
                              : field.value === instance.name
                              ? "Selected"
                              : "Select"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" className="hidden" />
                </ScrollArea>
              )}
            />
          </section>

          {/* SSH Key */}
          <section className="w-full flex flex-col gap-5 pb-7 border-b gray-border">
            <h1 className="font-medium text-lg font-[family-name:var(--font-geist-mono)]">
              SSH KeyPair
            </h1>
            {errors.sshPubKey ? (
              <p className="text-red-600">{errors.sshPubKey.message}</p>
            ) : undefined}
            <Controller
              name="sshPubKey"
              control={control}
              render={({ field }) => (
                <div className="w-full flex flex-col items-start gap-5">
                  {field.value && <SSHKeyHolder value={field.value} />}
                  <GenerateSSHKeyButton
                    value={field.value}
                    setValue={setValue}
                  />
                </div>
              )}
            />
          </section>

          {/* Duration */}
          <section className="w-full flex items-center justify-between gap-5 pb-7 border-b gray-border">
            <div className="flex flex-col gap-4">
              <h1 className="font-medium text-lg font-[family-name:var(--font-geist-mono)]">
                Terminate on
              </h1>
              {errors.terminateOn ? (
                <p className="text-red-600">{errors.terminateOn.message}</p>
              ) : undefined}
              <Controller
                name="terminateOn"
                control={control}
                render={({ field }) => (
                  // @ts-ignore
                  <DateTimePicker date={field.value} setValue={setValue} />
                )}
              />
            </div>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="cursor-pointer self-end"
                disabled={connectModalOpen || isConnecting || isDialogOpen}
                type={!isConnected ? "button" : "submit"}
                onClick={!isConnected ? openConnectModal : undefined}
              >
                {!isConnected ? (
                  <MdOutlineWallet />
                ) : isDialogOpen ? (
                  <RiLoader4Line className="animate-spin" />
                ) : (
                  <IoRocketSharp />
                )}
                {connectModalOpen || isConnecting
                  ? "Connecting"
                  : !isConnected
                  ? "Connect"
                  : isDialogOpen
                  ? "Launching"
                  : "Launch"}
              </Button>
            </DialogTrigger>
          </section>
        </div>

        {/* Loader */}
        <DialogContent className="border-gray-800">
          <DialogHeader className="flex flex-col items-center justify-center">
            <DialogTitle className="font-[family-name:var(--font-geist-mono)]">
              Launching Sphere
            </DialogTitle>
            <DialogDescription className="text-center">
              Confirm the transactions to launch your Sphere. Once approved,
              your cloud instance will be ready to use!
            </DialogDescription>
          </DialogHeader>

          <section className="flex flex-col items-center justify-center gap-5">
            <div className="w-full flex flex-col items-center justify-center gap-1">
              <h1 className="w-full flex items-center justify-center gap-2 font-medium text-xl font-[family-name:var(--font-geist-mono)]">
                Total cost:{" "}
                {rentalCost ? (
                  formatUnits(BigInt(rentalCost ?? 0), 6)
                ) : (
                  <Skeleton className="self-center h-5 w-[50px] bg-gray" />
                )}{" "}
                USDC
              </h1>
              <h1 className="font-medium text-md">
                <span className="font-[family-name:var(--font-geist-mono)]">
                  Owner:
                </span>{" "}
                {minifyAddress(address)}
              </h1>
              <p className="text-muted-foreground">
                Balance: {formatUnits(BigInt(usdcBalanceOfUser ?? 0), 6)} USDC
              </p>
            </div>

            <div className="flex gap-2 items-center justify-center">
              {isTxnSuccess ? (
                <FaRegCheckCircle className="text-xl text-green-500" />
              ) : BigInt(usdcBalanceOfUser ?? 0) < BigInt(rentalCost ?? 0) ? (
                <MdError className="text-red-600 text-xl" />
              ) : (
                <RiLoader4Line className="animate-spin text-xl" />
              )}
              <h1 className="font-medium">{currentTransactionStatus}</h1>
            </div>

            {BigInt(usdcBalanceOfUser ?? 0) < BigInt(rentalCost ?? 0) && (
              <Button
                type="button"
                variant="secondary"
                className="cursor-pointer dark"
                onClick={() => setIsDialogOpen(() => false)}
              >
                Close
              </Button>
            )}

            {isTxnSuccess && (
              <Link href={"/dashboard"}>
                <Button
                  type="button"
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setIsDialogOpen(() => false)}
                >
                  {BigInt(usdcBalanceOfUser ?? 0) < BigInt(rentalCost ?? 0)
                    ? "Cancel"
                    : "Let's go"}
                </Button>
              </Link>
            )}
          </section>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default LaunchInstanceForm;
