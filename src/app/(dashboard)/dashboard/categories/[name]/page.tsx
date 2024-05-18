import { Suspense } from "react";
import { CategoryCard } from "../_components/category-card";
import { CardLoader } from "../_components/loader";

export default async function CategoryPage({
  params,
}: {
  params: { name: string };
}) {
  const { name } = params;
  const itemName = name.replace(/-/g, " ");

  return (
    <Suspense fallback={<CardLoader />}>
      <CategoryCard itemName={itemName} />
    </Suspense>
  );
}
