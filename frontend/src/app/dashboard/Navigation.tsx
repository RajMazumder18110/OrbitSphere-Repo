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

const Navigation = () => {
  return (
    <NavigationMenu className="dark">
      <NavigationMenuList className="py-1 px-2 border-gray border rounded-lg">
        <NavigationMenuItem>
          <Link href="/dashboard?tab=running" legacyBehavior>
            <NavigationMenuLink
              tabName="running"
              className={navigationMenuTriggerStyle()}
            >
              Running
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/dashboard?tab=terminated" legacyBehavior>
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
  );
};

export default Navigation;
