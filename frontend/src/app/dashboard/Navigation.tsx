"use client";
/** @notice Library imports */
import Link from "next/link";
/// Local imports
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { OrbitSphereRoutes } from "@/constants";

const Navigation = () => {
  return (
    <NavigationMenu className="dark">
      <NavigationMenuList className="py-1 px-2 border-gray border rounded-lg">
        <NavigationMenuItem className="cursor-pointer">
          <Link
            href={`${OrbitSphereRoutes.DASHBOARD}?tab=running`}
            legacyBehavior
          >
            <NavigationMenuLink
              tabName="running"
              className={`${navigationMenuTriggerStyle()} text-muted-foreground`}
            >
              Running
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem className="cursor-pointer">
          <Link
            href={`${OrbitSphereRoutes.DASHBOARD}?tab=queued`}
            legacyBehavior
          >
            <NavigationMenuLink
              tabName="queued"
              className={`${navigationMenuTriggerStyle()} text-muted-foreground`}
            >
              Queued
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem className="cursor-pointer">
          <Link
            href={`${OrbitSphereRoutes.DASHBOARD}?tab=terminated`}
            legacyBehavior
          >
            <NavigationMenuLink
              tabName="terminated"
              className={`${navigationMenuTriggerStyle()} text-muted-foreground`}
            >
              Terminated
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navigation;
