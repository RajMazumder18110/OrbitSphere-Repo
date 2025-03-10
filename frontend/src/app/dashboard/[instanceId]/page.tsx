/** @notice library imports */
import Breadcrumbs from "@/components/Breadcrumbs";

/// Type
interface SingleInstanceDetailsProps {
  params: Promise<{
    instanceId: string;
  }>;
}

const SingleInstanceDetails = async ({
  params,
}: SingleInstanceDetailsProps) => {
  const { instanceId } = await params;

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumbs />
      <h1 className="text-3xl font-semibold font-[family-name:var(--font-geist-mono)]">
        &gt; {instanceId}
      </h1>

      <section></section>
    </div>
  );
};

export default SingleInstanceDetails;
