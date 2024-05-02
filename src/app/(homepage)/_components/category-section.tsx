import { getCategories } from "@/server/api/categories/queries";
import { CategoryCard } from "./category-card";

export async function CategorySection() {
  const categories = await getCategories({});

  return (
    <div className="mt-40 grid w-full gap-5 lg:grid-cols-3 lg:gap-8">
      {categories.map((category) => (
        <CategoryCard category={category} key={category.id} />
      ))}
    </div>
  );
}
