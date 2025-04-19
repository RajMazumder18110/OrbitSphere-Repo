import Link from "next/link";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full border-t gray-border mt-2 pt-5">
      <div className="flex flex-col gap-3 md:flex-row items-center justify-between">
        {/* Logo & Branding */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-semibold text-white">OrbitSphere</h2>
          <p className="text-sm text-muted-foreground">
            Decentralized Cloud Server Lending
          </p>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6 mt-4 md:mt-0 text-sm">
          <li>
            <Link href="#" className="hover:text-white transition">
              Docs
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-white transition">
              Pricing
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-white transition">
              Support
            </Link>
          </li>
        </ul>

        {/* Social Media */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white transition">
            <FaTwitter size={20} />
          </Link>
          <Link
            href="https://github.com/RajMazumder18110/OrbitSphere-Repo"
            className="hover:text-white transition"
          >
            <FaGithub size={20} />
          </Link>
          <Link
            href="https://www.linkedin.com/in/rajmazumder/"
            className="hover:text-white transition"
          >
            <FaLinkedin size={20} />
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-xs mt-6 border-t gray-border pt-4">
        © {new Date().getFullYear()} OrbitSphere. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
