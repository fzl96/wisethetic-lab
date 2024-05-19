import { reverseSlug } from "@/lib/utils";
import { MaxWidthWrapper } from "@/app/(homepage)/_components/max-width-wrapper";
import { PackageCards } from "./_components/package-cards";
import { Suspense } from "react";
import { PackageCardsLoader } from "./_components/package-cards-loader";

export default async function ProductCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const categoryName = reverseSlug(params.category);

  return (
    <MaxWidthWrapper className="mt-28 flex flex-col items-center justify-center px-5">
      <h1 className="font-accent text-2xl">{categoryName}</h1>
      <div className="mt-20 w-full">
        <Suspense fallback={<PackageCardsLoader />}>
          <PackageCards categoryName={categoryName} />
        </Suspense>
      </div>
    </MaxWidthWrapper>
  );
}
