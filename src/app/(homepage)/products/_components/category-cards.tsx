import Link from "next/link";
import { getCategories } from "@/server/api/categories/queries";
import { CategoryCard } from "../../_components/category-card";
import { convertToSlug } from "@/lib/utils";

export async function CategoryCards() {
  const categories = await getCategories({});

  return (
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
  );
}
