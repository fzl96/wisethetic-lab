import Image from "next/image";
import { Suspense } from "react";

import { getPackageByNameWithProducts } from "@/server/api/packages/queries";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { format } from "date-fns";
import { PackageCardActions } from "./card-actions";
import ProductContent from "./product-content";

interface ContentCardProps {
  categoryName: string;
  packageName: string;
  redirectUrl: string;
}

export async function ContentCard({
  categoryName,
  packageName,
  redirectUrl,
}: ContentCardProps) {
  const pkg = await getPackageByNameWithProducts(categoryName, packageName);

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
          <Suspense fallback={<Skeleton className="h-8 w-8" />}>
            {pkg && <PackageCardActions pkg={pkg} redirectUrl={redirectUrl} />}
          </Suspense>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-6 text-sm dark:bg-card">
        <div className="space-y-8">
          <div className="h-80 overflow-hidden rounded-lg">
            <Image
              src={pkg?.image ?? "/placeholder.jpg"}
              alt={pkg?.name ?? "Category Image"}
              width={300}
              height={200}
              className="h-full w-full object-cover transition-all duration-500 hover:scale-105 dark:brightness-[0.5] dark:grayscale hover:dark:grayscale-0"
            />
          </div>
          <Suspense
            fallback={
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            }
          >
            {pkg && (
              <ProductContent
                packageId={pkg.id}
                additionalContentPrice={pkg.additionalContentPrice}
              />
            )}
          </Suspense>
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
