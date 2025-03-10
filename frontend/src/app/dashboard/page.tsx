"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
/// Local imports
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { getInstancesBy, Instance } from "@/actions";
import { Button } from "@/components/ui/button";
import { InstancesTable } from "./InstancesTable";
import Breadcrumbs from "@/components/Breadcrumbs";

const DashboardPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [rowSelection, setRowSelection] = useState({});
  const [instances, setInstances] = useState<Instance[]>([]);

  const currentTab = params.get("tab")!;

  useEffect(() => {
    router.replace("/dashboard?tab=running");
  }, []);

  useEffect(() => {
    getInstancesBy(params.get("tab") ?? currentTab).then((data) =>
      setInstances(() => data)
    );
  }, [params]);

  return (
    <main className="flex flex-col gap-5">
      <Breadcrumbs />
      <h1 className="text-2xl font-semibold font-[family-name:var(--font-geist-mono)]">
        Dashboard
      </h1>

      <div className="w-full flex items-center justify-between">
        <NavigationMenu className="dark">
          <NavigationMenuList className="py-1 px-2 border-gray border rounded-lg">
            <NavigationMenuItem>
              <Link href="/dashboard?tab=running" legacyBehavior passHref>
                <NavigationMenuLink
                  tabName="running"
                  className={navigationMenuTriggerStyle()}
                >
                  Running
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/dashboard?tab=terminated" legacyBehavior passHref>
                <NavigationMenuLink
                  tabName="terminated"
                  className={navigationMenuTriggerStyle()}
                >
                  Terminated
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {currentTab !== "terminated" && (
          <Button
            className="cursor-pointer"
            variant="secondary"
            disabled={!Boolean(Object.keys(rowSelection).length)}
          >
            Terminate
          </Button>
        )}
      </div>

      <section className="w-full min-h-[55.5vh]">
        <InstancesTable
          data={instances}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          isTerminated={currentTab === "terminated"}
        />
      </section>
    </main>
  );
};

export default DashboardPage;
