/** @notice library imports */
import { ReactNode } from "react";
import { redirect, RedirectType } from "next/navigation";
/// Local imports
import Footer from "@/components/Footer";
import DashboardNavbar from "@/components/DashboardNavbar";
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
  return (
    <main className="w-full h-[97.6vh] max-h-screen flex flex-col items-center ">
      <DashboardNavbar />
      {children}
      <Footer />
    </main>
  );
};

export default DashboardLayout;
