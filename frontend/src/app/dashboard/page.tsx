import Link from "next/link";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
/// Local imports
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Navigation from "./Navigation";
import { getInstancesBy } from "@/actions";
import { Input } from "@/components/ui/input";
import Breadcrumbs from "@/components/Breadcrumbs";

/// DashboardLayout props
type DashboardPageProps = {
  searchParams: Promise<{ tab: string }>;
};

/// Active tabs
const tabs = ["running", "terminated"];

const Dashboard = async ({ searchParams }: DashboardPageProps) => {
  const params = await searchParams;
  const tab = params.tab;
  /// If tab not found or any random tab
  if (!tabs.includes(tab)) {
    redirect("/dashboard?tab=running");
  }
  /// Grabbing instances
  const instances = await getInstancesBy(tab);

  return (
    <main className="w-full h-full flex flex-col gap-7 mt-5">
      <div className="flex flex-col gap-5">
        <Breadcrumbs />
        <h1 className="text-2xl font-semibold font-[family-name:var(--font-geist-mono)]">
          Dashboard
        </h1>
      </div>

      <div className="w-full flex items-center justify-between">
        <Navigation />
        <div className="relative w-full max-w-40">
          <Input
            type="text"
            placeholder="Search sphere"
            className="pl-10 dark" // Adds padding to prevent overlap with the icon
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
        </div>
      </div>

      <section className="w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {instances.map((instance) => (
          <Link
            href={`/dashboard/${instance.instanceId}`}
            key={instance.instanceId}
          >
            <Card className="dark relative hover:border-gray-400 ease-in-out transition-all flex flex-col items-center gap-4">
              <MdOutlineRadioButtonChecked
                className={`${
                  instance.status === "TERMINATED"
                    ? "text-red-500"
                    : "text-green-400 animate-pulse"
                } text-md absolute top-2 right-2`}
              />
              <CardHeader className="flex flex-col items-center gap-2">
                <div className="flex flex-col gap-1 items-center">
                  {/* <CardTitle>Running </CardTitle> */}
                  <CardDescription className="text-md font-[family-name:var(--font-geist-mono)]">
                    <div className="flex flex-col items-center">
                      <p>({instance.id})</p>
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
