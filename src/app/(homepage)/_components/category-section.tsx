import Link from "next/link";

import { getCategories } from "@/server/api/categories/queries";
import { CategoryCard } from "./category-card";
import { convertToSlug } from "@/lib/utils";

export async function CategorySection() {
  const categories = await getCategories({});

  return (
    <div className="mt-40 grid w-full gap-5 lg:grid-cols-3 lg:gap-8">
      {categories.map((category) => {
        const link = convertToSlug(category.name);
        return (
          <Link href={`/products/${link}`} key={category.id}>
            <CategoryCard category={category} key={category.id} />
          </Link>
        );
      })}
    </div>
  );
}
