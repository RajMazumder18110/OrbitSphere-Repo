/** @notice Library imports */
import { Suspense } from "react";
import { PiSpinnerBold } from "react-icons/pi";
import { redirect, RedirectType } from "next/navigation";
import { InstanceStatus } from "@orbitsphere/database/schemas";
/// Local imports
import Navigation from "./Navigation";
import SpheresList from "./SpheresList";
import Authentication from "./Authentication";
import { OrbitSphereRoutes } from "@/constants";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getIsAuthenticated } from "@/actions/authentication";
import Footer from "@/components/Footer";
import DashboardNavbar from "@/components/DashboardNavbar";

/// DashboardLayout props
type DashboardPageProps = {
  searchParams: Promise<{ tab?: string; page?: string }>;
};

/// Active tabs
const tabs = ["running", "terminated", "queued"];

const Dashboard = async ({ searchParams }: DashboardPageProps) => {
  const authenticatedUser = await getIsAuthenticated();
  /// If user is not authenticated
  if (!authenticatedUser) {
    return <Authentication />;
  }

  /// Parsing search params
  let needsRedirect = false;
  const searchParamsParsed = await searchParams;
  const allParams = new URLSearchParams(searchParamsParsed);

  /// Handling `tab` param
  const currentTab = allParams.get("tab");
  if (!currentTab || !tabs.includes(currentTab)) {
    allParams.set("tab", "running");
    needsRedirect = true;
  }

  /// Handling `page` param
  const currentPage = Number(allParams.get("page"));
  if (!allParams.has("page") || isNaN(currentPage) || currentPage < 1) {
    allParams.set("page", "1");
    needsRedirect = true;
  }

  /// Redirect only if params were modified
  if (needsRedirect) {
    redirect(
      `${OrbitSphereRoutes.DASHBOARD}?${allParams.toString()}`,
      RedirectType.push
    );
  }

  return (
    <main className="w-full h-[97.6vh] max-h-screen flex flex-col items-center ">
      <DashboardNavbar />
      <section className="w-full grow flex flex-col gap-7 my-3">
        <div className="flex flex-col gap-5">
          <Breadcrumbs />
          <h1 className="text-2xl font-semibold font-[family-name:var(--font-geist-mono)]">
            Dashboard
          </h1>
        </div>

        <div className="w-full flex items-center justify-between">
          <Navigation />
        </div>

        <Suspense
          fallback={
            <div className="w-full h-full flex justify-center items-center">
              <PiSpinnerBold className="animate-spin text-5xl" />
            </div>
          }
        >
          <SpheresList
            page={currentPage}
            currentUrl={allParams}
            address={authenticatedUser.address}
            status={currentTab!.toUpperCase() as InstanceStatus}
          />
        </Suspense>
      </section>
      <Footer />
    </main>
  );
};

export default Dashboard;
