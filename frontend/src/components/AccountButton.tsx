"use client";
/** @notice Library imports */
import { useAccount } from "wagmi";
import { RiLoader4Line } from "react-icons/ri";
import { ConnectButton } from "@rainbow-me/rainbowkit";
/// Local imports
import { Button } from "./ui/button";
import { shotAddress } from "@/lib/utils";
import { MdOutlineWallet } from "react-icons/md";

const AccountButton = () => {
  const { isConnecting, address } = useAccount();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        connectModalOpen,
        openAccountModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <Button
            variant={"ghost"}
            className={`dark cursor-pointer font-semibold`}
            onClick={!connected ? openConnectModal : openAccountModal}
            disabled={!ready}
          >
            {isConnecting || connectModalOpen ? (
              <RiLoader4Line className="animate-spin" />
            ) : (
              <MdOutlineWallet />
            )}

            {connectModalOpen || isConnecting
              ? "Connecting"
              : connected
              ? shotAddress(address)
              : "Connect"}
          </Button>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default AccountButton;
