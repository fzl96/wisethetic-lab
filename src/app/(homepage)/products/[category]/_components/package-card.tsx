import Image from "next/image";
// import { getBase64 } from "@/lib/utils";
import { type PackageWithCategory } from "@/server/db/schema/product";
import { getPlaiceholder } from "plaiceholder";

export async function PackageCard({
  pkg,
  children,
}: {
  pkg: PackageWithCategory;
  children?: React.ReactNode;
}) {
  const res = await fetch(pkg.image ?? "");
  const buffer = await res.arrayBuffer();
  const { base64 } = await getPlaiceholder(Buffer.from(buffer));

  return (
    <div className="rounded-xl border border-home-border bg-home-card-background p-3 shadow-sm transition-all duration-200 hover:bg-home-card-background-hover">
      <div className="h-96 overflow-hidden rounded-lg lg:h-[35rem]">
        <Image
          src={pkg.image ?? "/placeholder.jpg"}
          alt={pkg.name}
          width={800}
          height={1000}
          blurDataURL={base64}
          placeholder="blur"
          className="relative h-full w-full object-cover transition-all duration-500 hover:scale-105"
        />
      </div>
      <div className="space-y-2 px-2 py-5 text-left ">
        <h3 className="text-left font-accent text-2xl font-normal">
          {pkg.name}
        </h3>
        <p className="text-muted-foreground">{pkg.description}</p>
      </div>
    </div>
  );
}
