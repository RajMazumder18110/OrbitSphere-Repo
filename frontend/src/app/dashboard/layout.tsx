/** @notice library imports */
import { ReactNode } from "react";
/// Local imports
import Footer from "@/components/Footer";
import DashboardNavbar from "@/components/DashboardNavbar";
import RainbowkitProviderComponent from "@/providers/RainbowkitProvider";

/// DashboardLayout props
type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  return (
    <RainbowkitProviderComponent>
      <main className="w-full h-[97.6vh] max-h-screen flex flex-col items-center ">
        <DashboardNavbar />
        {children}
        <Footer />
      </main>
    </RainbowkitProviderComponent>
  );
};

export default DashboardLayout;
