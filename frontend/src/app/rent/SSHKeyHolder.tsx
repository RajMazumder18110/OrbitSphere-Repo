/** @notice Library imports */
import { useState } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";

const SSHKeyHolder = ({ value }: { value: string }) => {
  const [isBlurred, setIsBlurred] = useState(true);

  return (
    <div
      className="relative group cursor-pointer w-full text-sm break-words whitespace-normal bg-[#0F0F0F] text-muted-foreground shadow-xs dark rounded-2xl p-2"
      onClick={() => setIsBlurred(!isBlurred)}
    >
      {/* The text */}
      <p
        className={`transition-all duration-300 p-4 ${
          isBlurred ? "blur-[2px]" : "blur-none"
        }`}
      >
        {value}
      </p>

      {isBlurred ? (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <LuEye className="text-2xl text-gray-100" />
        </div>
      ) : (
        /* When not blurred: Show EyeClosed icon on hover */
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <LuEyeClosed className="text-2xl text-gray-100" />
        </div>
      )}
    </div>
  );
};

export default SSHKeyHolder;
