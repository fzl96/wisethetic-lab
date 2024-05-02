import Link from "next/link";

import { MaxWidthWrapper } from "../_components/max-width-wrapper";
import { getCategories } from "@/server/api/categories/queries";
import { CategoryCard } from "../_components/category-card";

import { convertToSlug } from "@/lib/utils";

export default async function ProductsPage() {
  const categories = await getCategories({});

  return (
    <MaxWidthWrapper className="mt-28 flex flex-col items-center justify-center px-5 pb-12  text-center sm:mt-32">
      <div className="grid gap-20">
        <h1 className="">Categories</h1>
        <div className="grid w-full gap-5 lg:grid-cols-3 lg:gap-8">
          {categories.map((category) => {
            const link = convertToSlug(category.name);
            return (
              <Link href={`/products/${link}`} key={category.id}>
                <CategoryCard category={category} key={category.id} />
              </Link>
            );
          })}
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
