/// Library imports
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
/// Local imports
import "./globals.css";
import NextTopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// font-[family-name:var(--font-geist-sans)]

export const metadata: Metadata = {
  title: "OrbitSphere | Decentralized Cloud Server Lending",
  description:
    "OrbitSphere is a decentralized cloud server rental platform where users can rent pre-configured cloud servers and pay using USDC/USDT. The system is powered by smart contracts on Ethereum, and backend services manage AWS instances based on blockchain events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} hide-scrollbar antialiased min-h-screen w-screen`}
      >
        <NextTopLoader color="white" showSpinner={false} />
        <div className="max-w-5xl w-[90%] m-auto flex flex-col gap-5">
          {children}
          <Toaster theme="dark" />
        </div>
      </body>
    </html>
  );
}
