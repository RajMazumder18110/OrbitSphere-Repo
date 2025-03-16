/** @notice Library imports */
import Link from "next/link";
import { redirect } from "next/navigation";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import { PaginatedGetInstanceParams } from "@orbitsphere/database/handlers";
/// Local imports
import {
  Card,
  CardFooter,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrbitSphereRoutes } from "@/constants";
import { getInstancesByStatusWithServerAction } from "@/actions/database";

type SpheresListProps = PaginatedGetInstanceParams & {
  currentUrl: URLSearchParams;
};

const SpheresList = async (data: SpheresListProps) => {
  const { instances, metadata } = await getInstancesByStatusWithServerAction(
    data
  );

  /// If current page overflow
  if (Boolean(metadata.noOfRecords) && data.page! > metadata.totalPages) {
    data.currentUrl.set("page", "1");
    redirect(`${OrbitSphereRoutes.DASHBOARD}?${data.currentUrl.toString()}`);
  }

  // Create new URLSearchParams for links to avoid modifying `data.currentUrl`
  /// Next page params
  const nextParams = new URLSearchParams(data.currentUrl);
  nextParams.set("page", (data.page! + 1).toString());

  /// Previous page params
  const prevParams = new URLSearchParams(data.currentUrl);
  prevParams.set("page", Math.max(1, data.page! - 1).toString());

  return (
    <>
      {!Boolean(instances.length) && (
        <div className="w-full h-full flex items-center justify-center">
          <h1 className="text-2xl font-[family-name:var(--font-geist-mono)]">
            No instance found
          </h1>
        </div>
      )}
      <section className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
        {instances.map((instance) => (
          <Link
            href={`${OrbitSphereRoutes.DASHBOARD}/${instance.instanceId}`}
            key={instance.instanceId}
          >
            <Card className="dark relative hover:border-gray-400 ease-in-out transition-all flex flex-col items-center gap-4">
              <MdOutlineRadioButtonChecked
                className={`${
                  instance.status === "TERMINATED"
                    ? "text-red-500"
                    : instance.status === "QUEUED"
                    ? "text-yellow-400 animate-pulse"
                    : "text-green-400 animate-pulse"
                } text-md absolute top-2 right-2`}
              />
              <CardHeader className="flex flex-col items-center gap-2">
                <div className="flex flex-col gap-1 items-center">
                  {/* <CardTitle>Running </CardTitle> */}
                  <CardDescription className="text-md font-[family-name:var(--font-geist-mono)]">
                    <div className="flex flex-col items-center">
                      <p>({instance.sphereId})</p>
                      <p>{instance.instanceId}</p>
                    </div>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardFooter className="flex flex-col gap-3 items-center font-[family-name:var(--font-geist-mono)]">
                <h1>{instance.publicIp}</h1>

                <div className="flex flex-col items-center">
                  <h1>{instance.sphere.name}</h1>
                  <p className="text-muted-foreground">
                    {instance.region.name}
                  </p>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </section>

      {/* PAGINATION */}
      <div className="flex items-center justify-center">
        <Button
          variant="link"
          disabled={data.page === 1}
          asChild={data.page !== 1}
          className="dark cursor-pointer disabled:text-muted-foreground"
        >
          <Link
            href={`${OrbitSphereRoutes.DASHBOARD}?${prevParams.toString()}`}
          >
            Prev
          </Link>
        </Button>
        <Button
          variant="outline"
          className="dark disabled:text-muted-foreground"
        >
          {data.page}
        </Button>
        <Button
          variant="link"
          disabled={!metadata.hasNextPge}
          asChild={metadata.hasNextPge}
          className="dark cursor-pointer disabled:text-muted-foreground"
        >
          <Link
            href={`${OrbitSphereRoutes.DASHBOARD}?${nextParams.toString()}`}
          >
            Next
          </Link>
        </Button>
      </div>
    </>
  );
};

export default SpheresList;
