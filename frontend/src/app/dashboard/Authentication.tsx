/** @notice Library imports */
import Image from "next/image";
/// Local imports
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  MetamaskConnectButton,
  NormalConnectButton,
  TrustWalletConnectButton,
} from "../../components/ConnectButton";
import DashboardNavbar from "./DashboardNavbar";
import OrbitSphereIcon from "@/assets/orbitsphere.svg";
import RainbowkitProviderComponent from "@/providers/RainbowkitProvider";

const Authentication = () => {
  return (
    <RainbowkitProviderComponent>
      <main className="w-full h-[78vh] md:h-[85vh] flex flex-col items-center justify-between ">
        <DashboardNavbar />

        <div className="w-full min-h-full flex flex-col items-center">
          <section className="w-full h-full relative flex flex-col items-center justify-center">
            <Image
              src={OrbitSphereIcon}
              alt="OrbitSphere"
              className="absolute hidden sm:block inset-0 -z-10 opacity-40"
            />
            <section className="flex flex-col items-center gap-25">
              <Card className="dark">
                <CardHeader className="flex flex-col items-center gap-10 border-b gray-border pb-4">
                  <div className="flex flex-col gap-2">
                    <CardTitle>Connect Your Wallet</CardTitle>
                    <CardDescription>
                      Sign in securely to access OrbitSphere
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="w-full flex flex-col items-center gap-7">
                  <div className="w-full flex flex-col gap-2 items-center">
                    <MetamaskConnectButton />
                    <TrustWalletConnectButton />
                  </div>
                  <div className="w-full flex gap-5 items-center justify-center">
                    <p className="w-full h-[2px] bg-[#222] rounded"></p>
                    <p className="text-muted-foreground text-sm font-semibold">
                      Or
                    </p>
                    <p className="w-full h-[2px] bg-[#222] rounded"></p>
                  </div>
                  <NormalConnectButton className="w-full" />
                </CardFooter>
              </Card>
            </section>
          </section>
        </div>
      </main>
    </RainbowkitProviderComponent>
  );
};

export default Authentication;
