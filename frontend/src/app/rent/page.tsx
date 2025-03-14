/** @notice Library imports */
/// Local imports
import {
  getAllRegionsWithServerAction,
  getAllSpheresWithServerAction,
} from "@/actions/database";
import LaunchInstanceForm from "./LaunchForm";
import RainbowkitProvider from "@/providers/RainbowkitProvider";

const LaunchInstancePage = async () => {
  /// Grabbing instance & region details
  const regions = await getAllRegionsWithServerAction();
  const instances = await getAllSpheresWithServerAction();

  return (
    <RainbowkitProvider>
      <LaunchInstanceForm regions={regions} instances={instances} />
    </RainbowkitProvider>
  );
};

export default LaunchInstancePage;
