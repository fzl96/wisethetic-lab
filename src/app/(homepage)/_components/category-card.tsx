import { type Category } from "@/server/db/schema/product";
import Image from "next/image";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="rounded-xl border border-home-border bg-home-card-background p-3 shadow-sm transition-all duration-200 hover:bg-home-card-background-hover">
      <div className="h-96 overflow-hidden rounded-lg lg:h-[35rem]">
        <Image
          src={category.image ?? "/placeholder.jpg"}
          alt={category.name}
          width={300}
          height={384}
          className="h-full w-full object-cover transition-all duration-500 hover:scale-105"
        />
      </div>
      <div className="space-y-2 px-2 py-5 text-left ">
        <h3 className="text-left font-accent text-2xl font-medium">
          {category.name}
        </h3>
        <p className="font-light">From IDR 35.000</p>
      </div>
    </div>
  );
}
