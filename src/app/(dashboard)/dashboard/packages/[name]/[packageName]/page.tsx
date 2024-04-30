import { getPackageByNameWithProducts } from "@/server/api/packages/queries";
import { reverseSlug } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { format } from "date-fns";
import { PackageMenu } from "../../_components/actions";
import { getCategories } from "@/server/api/categories/queries";

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
  const categories = await getCategories({});

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start gap-5">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {pkg?.name}
          </CardTitle>
          <CardDescription>{pkg?.description}</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          {/* {category && <CategoryMenu category={category} />} */}
          {pkg && (
            <PackageMenu
              pkg={pkg}
              categories={categories}
              redirectUrl={params.name}
            />
          )}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-6 text-sm dark:bg-card">
        <div className="h-80 overflow-hidden rounded-lg">
          <Image
            src={pkg?.image ?? "/placeholder.jpg"}
            alt={pkg?.name ?? "Category Image"}
            width={300}
            height={200}
            className="h-full w-full object-cover transition-all duration-500 hover:scale-105 dark:brightness-[0.5] dark:grayscale hover:dark:grayscale-0"
          />
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-row items-center px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated{" "}
          <time dateTime={format(new Date(pkg?.updatedAt ?? ""), "yyyy-MM-dd")}>
            {format(new Date(pkg?.updatedAt ?? ""), "MMMM d, yyyy")}
          </time>
        </div>
      </CardFooter>
    </Card>
  );
}
