/** @notice Library imports */
import { ReactNode } from "react";
/// Local imports
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RentalPagelayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default RentalPagelayout;
