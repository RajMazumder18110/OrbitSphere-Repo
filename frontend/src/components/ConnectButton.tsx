"use client";
/** @notice Library imports */
import { useAccount } from "wagmi";
import { RiLoader4Line } from "react-icons/ri";
import { MdOutlineWallet } from "react-icons/md";
import { WalletButton, ConnectButton } from "@rainbow-me/rainbowkit";
/// Local imports
import { Button } from "@/components/ui/button";

export const MetamaskConnectButton = () => {
  return (
    <WalletButton.Custom wallet="metamask">
      {({ ready, connect }) => {
        return (
          <Button
            className="w-full cursor-pointer"
            type="button"
            disabled={!ready}
            onClick={connect}
          >
            <MdOutlineWallet /> Continue with Metamask
          </Button>
        );
      }}
    </WalletButton.Custom>
  );
};

export const TrustWalletConnectButton = () => {
  return (
    <WalletButton.Custom wallet="coinbase">
      {({ ready, connect }) => {
        return (
          <Button
            className="w-full cursor-pointer"
            type="button"
            disabled={!ready}
            onClick={connect}
          >
            <MdOutlineWallet /> Continue with Coinbase
          </Button>
        );
      }}
    </WalletButton.Custom>
  );
};

export const NormalConnectButton = ({ className }: { className?: string }) => {
  const { isConnecting } = useAccount();

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
            className={`cursor-pointer ${className}`}
            type={"button"}
            onClick={!connected ? openConnectModal : openAccountModal}
            disabled={false}
          >
            {isConnecting || connectModalOpen ? (
              <RiLoader4Line className="animate-spin" />
            ) : (
              <MdOutlineWallet />
            )}

            {connectModalOpen || isConnecting
              ? "Connecting"
              : connected
              ? "Account"
              : "Connect Wallet"}
          </Button>
        );
      }}
    </ConnectButton.Custom>
  );
};
