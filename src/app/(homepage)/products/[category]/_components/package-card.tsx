import Image from "next/image";
import { type PackageWithCategory } from "@/server/db/schema/product";

export async function PackageCard({
  pkg,
  children,
}: {
  pkg: PackageWithCategory;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-home-border bg-home-card-background p-3 shadow-sm transition-all duration-200 hover:bg-home-card-background-hover">
      <div className="h-96 overflow-hidden rounded-lg lg:h-[35rem]">
        <Image
          src={pkg.image ?? "/placeholder.jpg"}
          alt={pkg.name}
          width={800}
          height={1000}
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
