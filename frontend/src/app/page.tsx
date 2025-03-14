/// Local imports
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IoRocketSharp } from "react-icons/io5";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LuServerCog } from "react-icons/lu";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GrSecure } from "react-icons/gr";
import { IoMdGlobe } from "react-icons/io";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Navbar from "@/components/Navbar";
import OrbitSphereIcon from "@/assets/orbitsphere.svg";
import Image from "next/image";
import { formatUnits } from "viem";
import { getAllSpheresWithServerAction } from "@/actions/database";

export default async function Home() {
  const instances = await getAllSpheresWithServerAction();

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-25 items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
        {/* Hero Section */}
        <header className="relative h-[80vh] flex flex-col mt-10 gap-5 items-center justify-center">
          <Image
            src={OrbitSphereIcon}
            alt="OrbitSphere"
            className="absolute inset-0 -z-50 opacity-80"
          />
          <div className="flex flex-col gap-5 items-center">
            <h1 className="text-5xl font-bold font-[family-name:var(--font-geist-mono)]">
              OrbitSphere
            </h1>
            <p className="text-lg text-center text-muted-foreground">
              OrbitSphere is a decentralized cloud server rental platform where
              users can rent pre-configured cloud servers and pay using USDC.
              The system is powered by smart contracts.
            </p>
            <Link href={"/rent"}>
              <Button className="cursor-pointer" variant="secondary">
                <IoRocketSharp /> Launch
              </Button>
            </Link>
          </div>
        </header>

        {/* Features Section */}
        <section className="flex flex-col gap-5 items-center">
          <h2 className="text-3xl font-semibold font-[family-name:var(--font-geist-mono)]">
            Why Choose OrbitSphere?
          </h2>
          <div className="w-full grid md:grid-cols-4 gap-8">
            {[
              {
                title: "Instant Deployment",
                desc: "Spin up servers in seconds.",
                icon: LuServerCog,
              },
              {
                title: "Crypto Payments",
                desc: "Pay seamlessly with USDC/USDT.",
                icon: FaMoneyBillTransfer,
              },
              {
                title: "Secure & Reliable",
                desc: "High-performance AWS-backed servers.",
                icon: GrSecure,
              },
              {
                title: "Global Availability",
                desc: "Deploy in multiple AWS regions worldwide.",
                icon: IoMdGlobe,
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="dark flex flex-col items-center justify-center"
              >
                <CardHeader className="flex flex-col gap-3 items-center justify-center text-center">
                  <feature.icon className="text-center text-3xl" />
                  <div className="flex flex-col gap-1 items-center justify-center">
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.desc}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="flex flex-col gap-5 items-center justify-center">
          <h2 className="text-3xl font-semibold font-[family-name:var(--font-geist-mono)]">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Select Server",
                desc: "Choose a template that fits your needs.",
              },
              {
                step: "2",
                title: "Pay with Crypto",
                desc: "Complete the payment securely.",
              },
              {
                step: "3",
                title: "Access Instantly",
                desc: "Get your instance details & SSH access.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="dark flex flex-col items-center justify-center"
              >
                <CardHeader className="flex flex-col gap-2 items-center justify-center text-center">
                  <h1 className="text-center text-xl">{item.step}</h1>
                  <div className="flex flex-col gap-1 items-center justify-center">
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.desc}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="w-full flex flex-col gap-5 items-center justify-center">
          <h2 className="text-3xl font-semibold font-[family-name:var(--font-geist-mono)]">
            Pricing
          </h2>
          <ScrollArea className="w-full border-none">
            <div className="w-full flex items-center gap-5">
              {instances.map((instance) => (
                <Card className="dark w-[15rem] p-4 gap-3" key={instance.name}>
                  <CardHeader className="flex items-center justify-center text-lg p-0 font-semibold font-[family-name:var(--font-geist-mono)]">
                    {formatUnits(instance.hourlyRate, 6)} USDC/hour
                  </CardHeader>
                  <CardDescription className="flex items-center justify-center text-md font-semibold font-[family-name:var(--font-geist-mono)]">
                    {instance.name}
                  </CardDescription>
                  <CardContent className="w-full py-2 flex flex-col">
                    <div className="w-full flex items-center justify-between">
                      <h1 className="text-muted-foreground">
                        vCPUs: {instance.noOfCPUs.toString()}
                      </h1>
                      <h1 className="text-muted-foreground">
                        GPUs: {instance.noOfGPUs.toString()}
                      </h1>
                    </div>
                    <div className="w-full flex items-center justify-between">
                      <h1 className="text-muted-foreground">
                        mGiB: {instance.memoryGiB.toString()}
                      </h1>
                      <h1 className="text-muted-foreground">
                        sGiB: {instance.storageGiB.toString()}
                      </h1>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </section>

        {/* Call to Action */}
        <section className="flex flex-col gap-5 items-center text-center">
          <h2 className="text-3xl font-semibold font-[family-name:var(--font-geist-mono)]">
            Start Renting Your Cloud Server Today!
          </h2>
          <Link href={"/rent"}>
            <Button className="cursor-pointer" variant="secondary">
              <IoRocketSharp /> Launch
            </Button>
          </Link>
        </section>
      </div>
    </>
  );
}
