/** @notice Library imports */
import { ReactNode } from "react";
/// Local imports
import Navbar from "@/components/Navbar";

const RentalPageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default RentalPageLayout;
