import Link from "next/link";
import { redirect } from "next/navigation";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import { InstanceStatus } from "@orbitsphere/database/schemas";
/// Local imports
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Navigation from "./Navigation";
import Authentication from "./Authentication";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getIsAuthenticated } from "@/actions/authentication";
import { getInstancesByStatusWithServerAction } from "@/actions/database";
import { Button } from "@/components/ui/button";
import { OrbitSphereRoutes } from "@/constants";

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
  console.log(allParams);

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
    redirect(`${OrbitSphereRoutes.DASHBOARD}?${allParams.toString()}`);
  }

  /// Grabbing instances
  const { instances, metadata } = await getInstancesByStatusWithServerAction({
    page: currentPage!,
    address: authenticatedUser.address,
    status: currentTab!.toUpperCase() as InstanceStatus,
  });

  /// If current page overflow
  if (Boolean(metadata.noOfRecords) && currentPage > metadata.totalPages) {
    allParams.set("page", "1");
    redirect(`${OrbitSphereRoutes.DASHBOARD}?${allParams.toString()}`);
  }

  // Create new URLSearchParams for links to avoid modifying `allParams`
  /// Next page params
  const nextParams = new URLSearchParams(allParams);
  nextParams.set("page", (currentPage + 1).toString());

  /// Previous page params
  const prevParams = new URLSearchParams(allParams);
  prevParams.set("page", Math.max(1, currentPage - 1).toString());

  return (
    <main className="w-full grow flex flex-col gap-7 mt-5">
      <div className="flex flex-col gap-5">
        <Breadcrumbs />
        <h1 className="text-2xl font-semibold font-[family-name:var(--font-geist-mono)]">
          Dashboard
        </h1>
      </div>

      <div className="w-full flex items-center justify-between">
        <Navigation />
        <div className="flex items-center justify-center">
          <Button
            variant="link"
            disabled={currentPage === 1}
            asChild={currentPage !== 1}
            className="dark cursor-pointer disabled:text-muted-foreground"
          >
            <Link
              href={`${OrbitSphereRoutes.DASHBOARD}?${prevParams.toString()}`}
            >
              Prev
            </Link>
          </Button>
          <Button
            variant="link"
            disabled={!metadata.hasNextPge}
            asChild={metadata.hasNextPge}
            className="dark cursor-pointer disabled:text-muted-foreground"
          >
            <Link
              href={`${OrbitSphereRoutes.DASHBOARD}?${nextParams.toString()}`}
            >
              Next
            </Link>
          </Button>
        </div>
      </div>

      {!Boolean(instances.length) && (
        <div className="w-full h-full flex items-center justify-center">
          <h1 className="text-2xl font-[family-name:var(--font-geist-mono)]">
            No instance found
          </h1>
        </div>
      )}
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
        {instances.map((instance) => (
          <Link
            href={`${OrbitSphereRoutes.DASHBOARD}/${instance.instanceId}`}
            key={instance.instanceId}
          >
            <Card className="dark relative hover:border-gray-400 ease-in-out transition-all flex flex-col items-center gap-4">
              <MdOutlineRadioButtonChecked
                className={`${
                  instance.status === "TERMINATED"
                    ? "text-red-500"
                    : instance.status === "QUEUED"
                    ? "text-yellow-400 animate-pulse"
                    : "text-green-400 animate-pulse"
                } text-md absolute top-2 right-2`}
              />
              <CardHeader className="flex flex-col items-center gap-2">
                <div className="flex flex-col gap-1 items-center">
                  {/* <CardTitle>Running </CardTitle> */}
                  <CardDescription className="text-md font-[family-name:var(--font-geist-mono)]">
                    <div className="flex flex-col items-center">
                      <p>({instance.sphereId})</p>
                      <p>{instance.instanceId}</p>
                    </div>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardFooter className="flex flex-col gap-3 items-center font-[family-name:var(--font-geist-mono)]">
                <h1>{instance.publicIp}</h1>

                <div className="flex flex-col items-center">
                  <h1>{instance.sphere.name}</h1>
                  <p className="text-muted-foreground">
                    {instance.region.name}
                  </p>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default Dashboard;
