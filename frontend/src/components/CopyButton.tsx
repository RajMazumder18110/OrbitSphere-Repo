"use client";
/// Library imports
import { useState } from "react";
import { FiCopy } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { CopyToClipboard } from "react-copy-to-clipboard";
/// Local imports
import { Button } from "./ui/button";

const CopyButton = ({ text }: { text: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleOnCopy = () => {
    setIsCopied(() => true);
    setTimeout(() => setIsCopied(() => false), 1000);
  };

  return (
    <CopyToClipboard text={text} onCopy={handleOnCopy}>
      <Button
        size="icon"
        disabled={isCopied}
        variant="ghost"
        className="cursor-pointer disabled:text-gray-200"
      >
        {isCopied ? (
          <FaCheck className="text-2xl" />
        ) : (
          <FiCopy className="text-2xl" />
        )}
      </Button>
    </CopyToClipboard>
  );
};

export default CopyButton;
