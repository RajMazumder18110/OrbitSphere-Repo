/** @notice Library imports */
"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { ReactNode, useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  darkTheme,
  getDefaultConfig,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { getIsAuthenticated } from "@/actions/authentication";
import { siweAuthenticationAdapter } from "./siweAdapter";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    getIsAuthenticated().then((status) =>
      setIsAuthenticated(() => (status ? true : false))
    );
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitAuthenticationProvider
          adapter={siweAuthenticationAdapter}
          status={isAuthenticated ? "authenticated" : "unauthenticated"}
        >
          <RainbowKitProvider modalSize="compact" theme={darkTheme()}>
            {children}
          </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RainbowkitProviderComponent;
