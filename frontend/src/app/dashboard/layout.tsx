/** @notice library imports */
import { ReactNode } from "react";
/// Local imports
import DashboardNavbar from "./DashboardNavbar";
import Footer from "@/components/Footer";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <DashboardNavbar />
      {children}
    </>
  );
};

export default DashboardLayout;
