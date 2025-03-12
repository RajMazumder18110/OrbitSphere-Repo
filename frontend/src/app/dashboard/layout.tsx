/** @notice library imports */
import { ReactNode } from "react";
/// Local imports
import DashboardNavbar from "./DashboardNavbar";

/// DashboardLayout props
type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  return (
    <main className="w-full h-[85vh] flex flex-col items-center ">
      <DashboardNavbar />
      {children}
    </main>
  );
};

export default DashboardLayout;
