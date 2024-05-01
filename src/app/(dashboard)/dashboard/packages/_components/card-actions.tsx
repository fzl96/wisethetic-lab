import { getCategories } from "@/server/api/categories/queries";
import { type Package } from "@/server/db/schema/product";

import { PackageMenu } from "./actions";

interface PackageCardActionsProps {
  pkg: Package;
  redirectUrl: string;
}

export async function PackageCardActions({
  pkg,
  redirectUrl,
}: PackageCardActionsProps) {
  const categories = await getCategories({});
  return (
    <PackageMenu pkg={pkg} categories={categories} redirectUrl={redirectUrl} />
  );
}
