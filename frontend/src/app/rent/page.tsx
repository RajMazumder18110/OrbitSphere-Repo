/** @notice Library imports */
/// Local imports
import LaunchInstanceForm from "./LaunchForm";
import RainbowkitProvider from "@/providers/RainbowkitProvider";
import { getAllRegions } from "@/actions/database/regionServices";
import { getAllSpheres } from "@/actions/database/sphereServices";

const LaunchInstancePage = async () => {
  /// Grabbing instance & region details
  const regions = await getAllRegions();
  const instances = await getAllSpheres();

  return (
    <RainbowkitProvider>
      <LaunchInstanceForm regions={regions} instances={instances} />
    </RainbowkitProvider>
  );
};

export default LaunchInstancePage;
