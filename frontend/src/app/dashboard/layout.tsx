/** @notice library imports */
import { ReactNode } from "react";
/// Local imports
import DashboardNavbar from "./DashboardNavbar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <DashboardNavbar />
      {children}
    </>
  );
};

export default DashboardLayout;
