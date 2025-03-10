/** @notice Library imports */
/// Local imports
import LaunchInstanceForm from "./LaunchForm";
import RainbowkitProvider from "@/providers/RainbowkitProvider";
import { getAllActiveRegions, getAllActiveSpheres } from "@/actions";

const LaunchInstancePage = async () => {
  /// Grabbing instance & region details
  const regions = await getAllActiveRegions();
  const instances = await getAllActiveSpheres();

  return (
    <RainbowkitProvider>
      <LaunchInstanceForm regions={regions} instances={instances} />
    </RainbowkitProvider>
  );
};

export default LaunchInstancePage;
