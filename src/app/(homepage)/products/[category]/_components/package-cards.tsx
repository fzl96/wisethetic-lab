import Link from "next/link";
import { getPackagesByCategory } from "@/server/api/packages/queries";
import { convertToSlug } from "@/lib/utils";
import { PackageCard } from "./package-card";

export async function PackageCards({ categoryName }: { categoryName: string }) {
  const packages = await getPackagesByCategory(categoryName);
  const categoryLink = convertToSlug(categoryName);
  return (
    <div className="grid w-full gap-4 lg:grid-cols-3 lg:gap-8">
      {packages.map((pkg) => {
        const link = convertToSlug(pkg.name);
        return (
          <Link href={`/products/${categoryLink}/${link}`} key={pkg.id}>
            <PackageCard pkg={pkg} />
          </Link>
        );
      })}
    </div>
  );
}
