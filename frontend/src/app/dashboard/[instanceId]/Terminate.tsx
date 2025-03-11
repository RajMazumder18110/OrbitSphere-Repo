"use client";
/** @notice Library imports */
/// Local imports
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Terminate = ({ sphereId }: { sphereId: string }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant="destructive"
          type="button"
          className="dark cursor-pointer"
        >
          Terminate
        </Button>
      </DialogTrigger>
      <DialogContent className="dark border-gray-800">
        <DialogTitle>Terminate sphere</DialogTitle>
      </DialogContent>
    </Dialog>
  );
};

export default Terminate;
