import Image from "next/image";

import { getPkgWithProducts } from "@/server/api/packages/queries";
import { MaxWidthWrapper } from "@/app/(homepage)/_components/max-width-wrapper";
import { reverseSlug } from "@/lib/utils";
import { CartForm } from "./_components/form";

export default async function PackagePage({
  params,
}: {
  params: { category: string; package: string };
}) {
  const category = reverseSlug(params.category);
  const pkgName = reverseSlug(params.package);
  const pkg = await getPkgWithProducts(category, pkgName);

  return (
    <MaxWidthWrapper className="mt-14 flex flex-col items-center justify-center px-5 lg:max-w-6xl">
      <div className="flex flex-col gap-10 md:flex-row">
        <div className="h-96 overflow-hidden lg:h-[40rem] lg:w-[35rem]">
          <Image
            src={pkg?.image ?? "/placeholder.jpg"}
            alt={pkg?.name ?? params.package}
            width={1000}
            height={800}
            className="h-full w-full object-cover transition-all duration-500 hover:scale-105"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <h2 className="text-xl text-muted-foreground">
              {reverseSlug(params.category)}
            </h2>
            <h1 className="font-accent text-4xl">{pkg?.name}</h1>
          </div>
          <p className="text-lg text-muted-foreground">{pkg?.description}</p>
          {pkg && <CartForm pkg={pkg} />}
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
