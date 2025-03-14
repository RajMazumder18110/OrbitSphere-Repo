/** @notice library imports */
import { ReactNode } from "react";
/// Local imports
import RainbowkitProviderComponent from "@/providers/RainbowkitProvider";

/// DashboardLayout props
type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  return <RainbowkitProviderComponent>{children}</RainbowkitProviderComponent>;
};

export default DashboardLayout;
