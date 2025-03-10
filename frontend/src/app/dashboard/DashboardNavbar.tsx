/** @notice Library imports */
import Link from "next/link";
import { FaGlobeAsia } from "react-icons/fa";
import { IoRocketSharp } from "react-icons/io5";
/// Local imports
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between sticky py-2 font-medium border-b-2 gray-border">
      <Link href={"/"}>
        <header className="flex items-center gap-1">
          <FaGlobeAsia className="text-xl" />
          <p className="font-semibold">Sphere</p>
        </header>
      </Link>
      <div className="flex items-center justify-center gap-2">
        <Link href={"/rent"}>
          <Button className="cursor-pointer" variant="secondary">
            <IoRocketSharp />
            Launch
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
