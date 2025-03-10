/** @notice Library imports */
"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

const WALLETCONNECT_PROJECTID = "ed50aba748906733a199beb89090d225";

/// Rainbow config
const config = getDefaultConfig({
  appName: "OrbitSphere",
  projectId: WALLETCONNECT_PROJECTID,
  chains: [bscTestnet],
  ssr: true,
});

const queryClient = new QueryClient();

const RainbowkitProviderComponent = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RainbowkitProviderComponent;
