/** @notice Library imports */
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { MdKey } from "react-icons/md";
import { LuLoaderCircle } from "react-icons/lu";
import { UseFormSetValue } from "react-hook-form";
/// Local imports
import { Button } from "@/components/ui/button";
import { LaunchInstanceSchema } from "@/schemas";
import { generateKeyPair } from "@/actions/keyGenerator";

const GenerateSSHKeyButton = ({
  value,
  setValue,
}: {
  value: string;
  setValue: UseFormSetValue<LaunchInstanceSchema>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSSHKeyGeneration = async () => {
    setIsLoading(true);
    try {
      /// Generating key pair
      const { publicKey, privateKey } = await generateKeyPair();
      setValue("sshPubKey", publicKey);

      /// Create a Blob and trigger file download as PEM file
      /*
      
      const blob = new Blob([privateKey], { type: "application/x-pem-file" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "OrbitSphere.pem"; // Save as .pem file
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      */

      /// Show success message
      toast("SSH KeyPair generated", {
        description: "Successfully generated your key pair",
        className: "dark",
      });
    } catch (error) {
      toast("Opps!!", {
        description: "Failed to generate SSH Key",
        className: "dark",
      });
    }

    setIsLoading(false);
  };

  return (
    <Button
      className="cursor-pointer dark"
      variant="secondary"
      type="button"
      disabled={isLoading}
      onClick={handleSSHKeyGeneration}
    >
      {isLoading ? <LuLoaderCircle /> : <MdKey />}{" "}
      {isLoading ? "Generating..." : value ? "Regenerate" : "Generate"}
    </Button>
  );
};

export default GenerateSSHKeyButton;
