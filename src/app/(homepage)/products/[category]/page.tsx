import { reverseSlug } from "@/lib/utils";
import { MaxWidthWrapper } from "@/app/(homepage)/_components/max-width-wrapper";
import { PackageCards } from "./_components/package-cards";
import { Suspense } from "react";

export default async function ProductCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const categoryName = reverseSlug(params.category);

  return (
    <MaxWidthWrapper className="mt-28 flex flex-col items-center justify-center px-5 pb-12  text-center sm:mt-32">
      <div className="grid gap-20">
        <h1 className="font-accent text-2xl">{categoryName}</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <PackageCards categoryName={categoryName} />
        </Suspense>
      </div>
    </MaxWidthWrapper>
  );
}
