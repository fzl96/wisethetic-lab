import { getPackagesByCategory } from "@/server/api/packages/queries";
import { PackageCard } from "./package-card";

export async function PackageCards({ categoryName }: { categoryName: string }) {
  const packages = await getPackagesByCategory(categoryName);
  return (
    <div className="grid w-full gap-4 lg:grid-cols-3 lg:gap-8">
      {packages.map((pkg) => {
        return <PackageCard pkg={pkg} key={pkg.id} />;
      })}
    </div>
  );
}
