import Image from "next/image";

import { getPkgWithProducts } from "@/server/api/packages/queries";
import { CartForm } from "./form";

export async function ProductContent({
  category,
  pkgName,
}: {
  category: string;
  pkgName: string;
}) {
  const pkg = await getPkgWithProducts(category, pkgName);
  return (
    <>
      <div className="h-96 overflow-hidden lg:h-[40rem] lg:w-[35rem]">
        <Image
          src={pkg?.image ?? "/placeholder.jpg"}
          alt={pkg?.name ?? pkgName}
          width={1000}
          height={800}
          className="h-full w-full object-cover transition-all duration-500 hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <h2 className="text-xl text-muted-foreground">{category}</h2>
          <h1 className="font-accent text-4xl">{pkg?.name}</h1>
        </div>
        <p className="text-lg text-muted-foreground">{pkg?.description}</p>
        {pkg && <CartForm pkg={pkg} />}
      </div>
    </>
  );
}
