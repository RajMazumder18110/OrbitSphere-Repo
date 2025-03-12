/** @notice library imports */
import { ReactNode } from "react";
import { redirect, RedirectType } from "next/navigation";
/// Local imports
import { getIsAuthenticated } from "@/actions/authentication";

/// DashboardLayout props
type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const isAuthenticated = await getIsAuthenticated();
  /// If user is not authenticated
  if (!isAuthenticated) {
    redirect("/dashboard", RedirectType.replace);
  }

  /// If user is authenticated
  return children;
};

export default DashboardLayout;
