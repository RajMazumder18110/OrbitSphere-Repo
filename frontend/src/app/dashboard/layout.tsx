/** @notice library imports */
import { ReactNode } from "react";
/// Local imports
import DashboardNavbar from "./DashboardNavbar";
import { getIsAuthenticated } from "@/actions";
import Authentication from "./Authentication";

/// DashboardLayout props
type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const isAuthenticated = await getIsAuthenticated();
  /// If user is not authenticated
  if (!isAuthenticated) {
    return <Authentication />;
  }

  /// If user is authenticated
  return (
    <main className="w-full h-[85vh] flex flex-col items-center justify-between ">
      <DashboardNavbar />
      {children}
    </main>
  );
};

export default DashboardLayout;
