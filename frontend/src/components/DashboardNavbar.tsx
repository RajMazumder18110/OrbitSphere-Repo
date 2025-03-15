/** @notice Library imports */
import Link from "next/link";
import { IoRocketSharp } from "react-icons/io5";
/// Local imports
import AccountButton from "./AccountButton";
import { OrbitSphereRoutes } from "@/constants";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between py-2 font-medium border-b-2 gray-border">
      <Link href={OrbitSphereRoutes.ROOT}>
        <header className="flex items-center gap-1">
          <p className="font-semibold">OrbitSphere</p>
        </header>
      </Link>
      <div className="flex items-center justify-center gap-2">
        <AccountButton />
        <Link href={OrbitSphereRoutes.RENT}>
          <Button className="dark cursor-pointer" variant="link">
            <IoRocketSharp />
            Launch
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
