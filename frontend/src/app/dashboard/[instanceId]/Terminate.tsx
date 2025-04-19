"use client";
/** @notice Library imports */
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RiLoader4Line } from "react-icons/ri";
import { FaRegCheckCircle } from "react-icons/fa";
import { orbitSphereAbi } from "@orbitsphere/blockchain";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
/// Local imports
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ORBITSPHERE } from "@/constants";

const Terminate = ({ sphereId }: { sphereId: bigint }) => {
  const router = useRouter();
  /// States
  const [currentStatus, setCurrentStatus] = useState("");
  const [isTxnSuccess, setIsTxnSuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  /// Wagmi
  const publicClient = usePublicClient();
  const { isConnected, address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const onTerminate = async () => {
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

      /// Termination transaction

      setCurrentStatus("Requested for termination transaction");
      const hash = await writeContractAsync({
        account: address,
        address: ORBITSPHERE,
        abi: orbitSphereAbi,
        functionName: "terminateSphere",
        args: [sphereId],
      });

      /// Waiting for transaction receipt
      setCurrentStatus("Waiting for termination transaction");
      await publicClient.waitForTransactionReceipt({ hash });

      setIsTxnSuccess(true);
      setCurrentStatus("Successfully launched Sphere");
      toast("Congratulations 🎉", {
        description: "Successfully terminated sphere 🔥. Will update soon. ",
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
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          className="dark grow md:grow-0 cursor-pointer"
          onClick={onTerminate}
        >
          Terminate
        </Button>
      </DialogTrigger>
      <DialogContent className="border-gray-800">
        <DialogHeader className="flex flex-col items-center justify-center">
          <DialogTitle className="font-[family-name:var(--font-geist-mono)]">
            Terminating Sphere
          </DialogTitle>
          <DialogDescription className="text-center">
            Confirm the transactions to terminate your Sphere. Once approved,
            your sphere will be terminated!
          </DialogDescription>
        </DialogHeader>

        <section className="flex flex-col items-center justify-center gap-5">
          <div className="flex gap-2 items-center justify-center">
            {isTxnSuccess ? (
              <FaRegCheckCircle className="text-xl text-green-500" />
            ) : (
              <RiLoader4Line className="animate-spin text-xl" />
            )}
            <h1 className="font-medium">{currentStatus}</h1>
          </div>

          {isTxnSuccess && (
            <Button
              type="button"
              variant="secondary"
              className="cursor-pointer"
              onClick={() =>
                setTimeout(() => {
                  setIsDialogOpen(() => false);
                  router.replace("/dashboard");
                }, 1000)
              }
            >
              Done
            </Button>
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default Terminate;
