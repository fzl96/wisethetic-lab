import { getPackageByNameWithProducts } from "@/server/api/packages/queries";
import { reverseSlug } from "@/lib/utils";

export default async function PackageNamePage({
  params,
}: {
  params: {
    name: string;
    packageName: string;
  };
}) {
  const categoryName = reverseSlug(params.name);
  const pkgName = reverseSlug(params.packageName);
  const pkg = await getPackageByNameWithProducts(categoryName, pkgName);
  console.log(pkg);
  return <div>{JSON.stringify(params, null, 2)}</div>;
}
