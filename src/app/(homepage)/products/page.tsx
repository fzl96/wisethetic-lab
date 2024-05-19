import { Suspense } from "react";
import { MaxWidthWrapper } from "../_components/max-width-wrapper";
import { CategoryCards } from "./_components/category-cards";
import { CategoryCardsLoader } from "./_components/loader";

export default async function ProductsPage() {
  return (
    <MaxWidthWrapper className="mt-28 flex flex-col items-center justify-center space-y-20 px-5">
      <h1 className="font-accent text-2xl">Categories</h1>
      <div className="w-full">
        <Suspense fallback={<CategoryCardsLoader />}>
          <CategoryCards />
        </Suspense>
      </div>
    </MaxWidthWrapper>
  );
}
